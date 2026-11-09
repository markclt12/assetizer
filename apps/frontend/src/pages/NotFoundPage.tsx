import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/States";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageFrame } from "../layouts/PageFrame";

export function NotFoundPage() {
  useDocumentTitle("Not found");
  return (
    <PageFrame>
      <EmptyState title="This page isn't on the menu">
        <Button asChild variant="outline">
          <Link to="/">Back to the entrance</Link>
        </Button>
      </EmptyState>
    </PageFrame>
  );
}
