export enum WidgetType {
  MusicPlayer = "music-player",
  AmbientSounds = "ambient-sounds",
  TodoList = "todo-list",
  Pomodoro = "pomodoro",
  StickyNotes = "sticky-notes",
  MiniJournal = "mini-journal",
}

export interface Widget {
  id: string
  type: WidgetType
  position: {
    x: number
    y: number
  }
  visible: boolean
}

