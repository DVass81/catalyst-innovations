export type PlaybackSnapshot = {
  elapsed: number;
  playing: boolean;
  reduced: boolean;
};

/** A single owner prevents nearby demonstrations from competing for attention. */
export function createPlaybackCoordinator() {
  let owner: object | null = null;
  let stop: (() => void) | null = null;
  return {
    claim(next: object, pause: () => void) {
      if (owner !== next) stop?.();
      owner = next;
      stop = pause;
    },
    release(current: object) {
      if (owner === current) {
        owner = null;
        stop = null;
      }
    },
  };
}
export const storyCoordinator = createPlaybackCoordinator();

export function createStoryPlayer(
  duration: number,
  autoplay: boolean,
  coordinator = storyCoordinator,
) {
  let snapshot: PlaybackSnapshot = {
    elapsed: 0,
    playing: false,
    reduced: false,
  };
  let elapsed = 0;
  let visible = false;
  let documentVisible = true;
  let started = false;
  let resume = false;
  const listeners = new Set<() => void>();
  const identity = {};
  const publish = (next: Partial<PlaybackSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    listeners.forEach((fn) => fn());
  };
  const stop = (allowResume = false) => {
    resume = allowResume && snapshot.playing;
    coordinator.release(identity);
    if (snapshot.playing) publish({ playing: false, elapsed });
  };
  const play = () => {
    if (snapshot.reduced || !visible || !documentVisible) return;
    if (elapsed >= duration) elapsed = 0;
    started = true;
    resume = false;
    coordinator.claim(identity, () => stop());
    publish({ playing: true, elapsed });
  };
  const maybePlay = () => {
    if (
      visible &&
      documentVisible &&
      !snapshot.reduced &&
      ((autoplay && !started) || resume)
    )
      play();
  };
  return {
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    getSnapshot: () => snapshot,
    setVisible(value: boolean) {
      if (visible === value) return;
      visible = value;
      if (!value) {
        if (snapshot.playing) stop(true);
      } else maybePlay();
    },
    setDocumentVisible(value: boolean) {
      if (documentVisible === value) return;
      documentVisible = value;
      if (!value) {
        if (snapshot.playing) stop(true);
      } else maybePlay();
    },
    setReduced(value: boolean) {
      if (snapshot.reduced === value) return;
      if (value) {
        stop();
        started = true;
      }
      publish({ reduced: value });
    },
    play,
    pause: () => {
      started = true;
      stop();
    },
    replay() {
      elapsed = 0;
      publish({ elapsed });
      play();
    },
    seek(value: number) {
      started = true;
      stop();
      elapsed = Math.max(0, Math.min(duration, value));
      publish({ elapsed });
    },
    tick(delta: number) {
      if (!snapshot.playing || !Number.isFinite(delta) || delta < 0) return;
      elapsed = Math.min(duration, elapsed + delta);
      if (elapsed >= duration) {
        stop();
        publish({ elapsed });
      } else if (
        Math.floor(elapsed / 100) !== Math.floor(snapshot.elapsed / 100)
      )
        publish({ elapsed });
    },
    dispose() {
      visible = false;
      if (snapshot.playing) stop(true);
      else coordinator.release(identity);
    },
  };
}

export function stepAt(elapsed: number, count: number, duration: number) {
  return Math.max(
    0,
    Math.min(count - 1, Math.floor(elapsed / (duration / count))),
  );
}
