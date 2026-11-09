import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { TopicSummaryDto } from "@assetizers/shared";
import { Card } from "../../components/Card";
import { FALLBACK_ILLUSTRATION } from "../../lib/catalog";
import styles from "./TopicMenu.module.css";

/**
 * Bulleted topic list with the decorative "element" panel on the right.
 * The panel shows the food illustration of the hovered/focused topic.
 */
export function TopicMenu({
  topics,
  accent,
  accentText,
  hrefFor,
}: {
  topics: TopicSummaryDto[];
  accent: string;
  accentText: string;
  hrefFor: (topic: TopicSummaryDto) => string;
}) {
  const [activeId, setActiveId] = useState(topics[0]?.id);
  const active = topics.find((topic) => topic.id === activeId) ?? topics[0];
  const vars = { "--menu-accent": accent, "--menu-text": accentText } as CSSProperties;

  return (
    <div className={styles.layout} style={vars}>
      <ul className={styles.list}>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              to={hrefFor(topic)}
              className={`${styles.item} ${topic.id === active?.id ? styles.itemActive : ""}`}
              onMouseEnter={() => setActiveId(topic.id)}
              onFocus={() => setActiveId(topic.id)}
            >
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>

      <Card accent={accent} className={styles.element} aria-hidden>
        <img
          key={active?.id}
          className={styles.illustration}
          src={active?.illustration || FALLBACK_ILLUSTRATION}
          alt=""
          onError={(event) => {
            if (!event.currentTarget.src.endsWith(FALLBACK_ILLUSTRATION)) {
              event.currentTarget.src = FALLBACK_ILLUSTRATION;
            }
          }}
        />
      </Card>
    </div>
  );
}
