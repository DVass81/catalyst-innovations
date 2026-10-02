export const workaroundsStory = [
  { start: 0, label: "Manual work and disconnected tools", description: "An older computer opens to reveal duplicate records and stalled handoffs." },
  { start: 5, label: "Customer information—entered once", description: "Separate copies become one customer record that follows the work." },
  { start: 8, label: "Approved jobs, schedules, and materials—connected", description: "Quote approval connects the office, the schedule, and the materials needed for the job." },
  { start: 11, label: "Completed work—ready for invoicing", description: "Completed job details carry into invoice preparation and reporting." },
  { start: 14, label: "Your business. Working together.", description: "The connected processes assemble into a new workstation, ending with the Catalyst Innovations logo." },
] as const;

export function workaroundsStageAt(seconds: number) {
  const time = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  let index = 0;
  for (let next = 1; next < workaroundsStory.length; next++) {
    if (time < workaroundsStory[next].start) break;
    index = next;
  }
  return index;
}

export type WorkaroundsSnapshot = {
  playing: boolean;
  showFilm: boolean;
  available: boolean;
  stage: number;
  manualOnly: boolean;
};

export const initialWorkaroundsSnapshot: WorkaroundsSnapshot = {
  playing: false,
  showFilm: false,
  available: false,
  stage: 0,
  manualOnly: false,
};

export type StoryConnection = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

/** Missing browser connection information should not block ordinary playback. */
export function prefersManualStory(connection?: StoryConnection) {
  return Boolean(connection && (connection.saveData ||
    ["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? "") ||
    (typeof connection.downlink === "number" && connection.downlink <= 1.5) ||
    (typeof connection.rtt === "number" && connection.rtt >= 500)));
}

type Coordinator = {
  claim(owner: object, stop: () => void): void;
  release(owner: object): void;
};

/** Keeps playback intent separate from browser media events and delayed play promises. */
export function createWorkaroundsPlayer(
  element: HTMLVideoElement,
  coordinator: Coordinator,
  onChange: (snapshot: WorkaroundsSnapshot) => void,
  options: { source?: string; manualOnly?: boolean } = {},
) {
  const owner = {};
  let snapshot = { ...initialWorkaroundsSnapshot, manualOnly: Boolean(options.manualOnly) };
  let manualOnly = Boolean(options.manualOnly);
  let manuallyRequested = false;
  let ready = false;
  let nearby = false;
  let visible = false;
  let documentVisible = true;
  let reduced = false;
  let started = false;
  let wantsPlay = false;
  let failed = false;
  let disposed = false;
  let revision = 0;
  let pending: number | null = null;

  const publish = (next: Partial<WorkaroundsSnapshot>) => {
    if (disposed || Object.entries(next).every(([key, value]) => snapshot[key as keyof WorkaroundsSnapshot] === value)) return;
    snapshot = { ...snapshot, ...next };
    onChange(snapshot);
  };
  const eligible = () => ready && !disposed && !failed && !reduced && documentVisible;
  const canPlay = () => eligible() && visible && (!manualOnly || manuallyRequested);
  const stop = (preserveIntent = false) => {
    if (!preserveIntent) wantsPlay = false;
    revision++;
    pending = null;
    element.pause();
    publish({ playing: false });
    coordinator.release(owner);
  };
  const syncStage = () => publish({ stage: workaroundsStageAt(element.currentTime) });
  const attemptPlay = () => {
    if (!canPlay() || !wantsPlay || pending !== null || !element.paused) return;
    const attempt = ++revision;
    pending = attempt;
    coordinator.claim(owner, () => stop());
    publish({ playing: true });
    void element.play().then(() => {
      if (disposed || attempt !== revision) return;
      pending = null;
      if (!canPlay() || !wantsPlay) stop(true);
    }).catch(() => {
      if (disposed || attempt !== revision) return;
      pending = null;
      // An autoplay rejection is recoverable with the visible Play button.
      wantsPlay = false;
      publish({ playing: false });
      coordinator.release(owner);
    });
  };
  const reconcile = () => {
    if (disposed) return;
    if (eligible() && (nearby || visible)) {
      if ((!manualOnly || manuallyRequested) && !element.getAttribute("src")) {
        element.preload = "metadata";
        element.src = options.source ?? "/brand/catalyst-workarounds-v1.mp4";
      }
      publish({ available: true });
    }
    if (!canPlay()) {
      if (!element.paused || pending !== null) stop(true);
      return;
    }
    if (!started) {
      started = true;
      wantsPlay = true;
    }
    attemptPlay();
  };
  const play = () => {
    if (!eligible()) return;
    manuallyRequested = true;
    if (element.ended) {
      element.currentTime = 0;
      syncStage();
    }
    started = true;
    wantsPlay = true;
    reconcile();
  };
  const onPlaying = () => {
    if (!canPlay() || !wantsPlay) {
      stop(true);
      return;
    }
    publish({ playing: true, showFilm: true });
    syncStage();
  };
  const onPause = () => {
    if (!element.paused) return;
    publish({ playing: false });
    coordinator.release(owner);
  };
  const onEnded = () => {
    started = true;
    wantsPlay = false;
    pending = null;
    revision++;
    publish({ playing: false, stage: workaroundsStory.length - 1 });
    coordinator.release(owner);
  };
  const onError = () => {
    failed = true;
    stop();
    publish({ available: false, showFilm: false, stage: 0 });
  };
  const listeners = {
    playing: onPlaying,
    pause: onPause,
    ended: onEnded,
    error: onError,
    timeupdate: syncStage,
    seeking: syncStage,
    seeked: syncStage,
  };
  for (const [event, listener] of Object.entries(listeners)) element.addEventListener(event, listener);

  return {
    getSnapshot: () => snapshot,
    setReady(value: boolean) { ready = value; reconcile(); },
    setNearby(value: boolean) { nearby = value; reconcile(); },
    setVisible(value: boolean) { visible = value; reconcile(); },
    setDocumentVisible(value: boolean) { documentVisible = value; reconcile(); },
    setManualOnly(value: boolean) {
      manualOnly = value;
      publish({ manualOnly: value });
      reconcile();
    },
    setReduced(value: boolean) {
      if (reduced === value) return;
      reduced = value;
      if (value) {
        started = true;
        stop();
        publish({ available: false, showFilm: false, stage: 0 });
      }
      reconcile();
    },
    toggle() {
      if (wantsPlay && (pending !== null || !element.paused)) {
        started = true;
        stop();
      } else play();
    },
    replay() {
      if (!eligible()) return;
      element.currentTime = 0;
      syncStage();
      play();
    },
    dispose() {
      disposed = true;
      for (const [event, listener] of Object.entries(listeners)) element.removeEventListener(event, listener);
      stop();
    },
  };
}
