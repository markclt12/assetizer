import styles from "./VideoPlayer.module.css";

function toEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function VideoPlayer({ src, title }: { src: string; title: string }) {
  const embed = toEmbedUrl(src);
  return (
    <div className={styles.wrapper}>
      {embed ? (
        <iframe
          className={styles.media}
          src={embed}
          title={title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video className={styles.media} src={src} controls preload="metadata" aria-label={title} />
      )}
    </div>
  );
}
