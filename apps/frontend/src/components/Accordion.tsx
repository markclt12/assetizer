import type { ReactNode } from "react";
import { Accordion as RadixAccordion } from "radix-ui";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string[] }) {
  return (
    <RadixAccordion.Root type="multiple" defaultValue={defaultOpen} className={styles.root}>
      {items.map((item) => (
        <RadixAccordion.Item key={item.id} value={item.id} className={styles.item}>
          <RadixAccordion.Header className={styles.header}>
            <RadixAccordion.Trigger className={styles.trigger}>
              {item.title}
              <span className={styles.chevron} aria-hidden>
                ▾
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className={styles.content}>{item.content}</RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
