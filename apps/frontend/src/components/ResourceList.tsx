import type { ResourceDto } from "@assetizers/shared";
import styles from "./ResourceList.module.css";

export function ResourceList({ resources }: { resources: ResourceDto[] }) {
  if (resources.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="resources-heading">
      <h3 id="resources-heading" className={styles.heading}>
        Take-away resources
      </h3>
      <ul className={styles.list}>
        {resources.map((resource) => (
          <li key={resource.id}>
            <a href={resource.fileUrl} target="_blank" rel="noreferrer" download>
              {resource.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
