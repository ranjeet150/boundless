'use client';

import { useParams, useSearchParams } from 'next/navigation';

import AiRegenerateControl from '@/components/ai/AiRegenerateControl';
import {
  useDraft,
  useRegenerateDraftSection,
  type DraftRegenSection,
} from '@/features/hackathons';

interface RegenerateSectionButtonProps {
  /** Which AI section to regenerate (criteria | prizes | timeline | description). */
  section: DraftRegenSection;
  /** Apply the regenerated values (wizard section shape) to the tab's form. */
  onApply: (data: Record<string, unknown>) => void;
  label?: string;
}

/**
 * Per-section "Regenerate with AI" for the hackathon wizard. Derives the org +
 * draft from the route, renders only on AI-generated drafts, and delegates the
 * steerable + preview/accept-discard UX to the shared AiRegenerateControl.
 */
export default function RegenerateSectionButton({
  section,
  onApply,
  label,
}: RegenerateSectionButtonProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const organizationId = (params?.id as string) ?? '';
  const draftId =
    (params?.draftId as string) ?? searchParams.get('draftId') ?? '';

  const { data: draft } = useDraft(organizationId, draftId || undefined);
  const regenerate = useRegenerateDraftSection(organizationId);

  return (
    <AiRegenerateControl
      available={Boolean(draftId && draft?.aiGeneration)}
      isRunning={regenerate.isPending}
      label={label}
      onRun={instructions =>
        regenerate
          .mutateAsync({ draftId, body: { section, instructions } })
          .then(r => r.data as Record<string, unknown>)
      }
      onApply={onApply}
    />
  );
}
