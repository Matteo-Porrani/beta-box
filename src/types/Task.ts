/*
The benefits of using a class here are:
1.Encapsulated Behavior: We've added useful methods like:
  toggle() for toggling the done status
  toggleStar() for toggling the starred status
  isOverdue() to check if the task is overdue
  toJSON() for serialization
2.Better Constructor: The constructor now:
  Has proper TypeScript typing
  Sets default values (done and starred default to false)
  Handles the dueAt calculation internally
  Makes optional fields explicit
3.Type Safety: You get better TypeScript support and IDE autocompletion
  You can now use these methods anywhere in your application. For example:
 */


export class Task {
  id?: number;
  desc: string;
  done: boolean;
  starred: boolean;
  dueAt: string;
  tagId: number | null;

  constructor(data: {
    id?: number;
    desc: string;
    dueAt: string;
    done?: boolean;
    starred?: boolean;
    tagId?: number | null;
  }) {
    this.id = data.id;
    this.desc = data.desc;
    this.done = data.done ?? false;
    this.starred = data.starred ?? false;
    this.dueAt = data.dueAt ?? null;
    this.tagId = data.tagId ?? null;
  }

  toggle() {
    this.done = !this.done;
  }

  toggleStar() {
    this.starred = !this.starred;
  }

  isOverdue(): boolean {
    return new Date(this.dueAt).getTime() < new Date().getTime();
  }

  toJSON() {
    return {
      id: this.id,
      desc: this.desc,
      done: this.done,
      starred: this.starred,
      dueAt: this.dueAt,
      tagId: this.tagId
    };
  }
}
