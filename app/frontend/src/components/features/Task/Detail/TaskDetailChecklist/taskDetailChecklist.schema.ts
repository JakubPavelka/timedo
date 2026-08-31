import { TaskChecklistSchema } from '@timedo/shared/src/schemas/taskChecklistSchema';

export const AddChecklistItemSchema = TaskChecklistSchema.pick({ label: true });
