const defaultAnnouncements = {
  onDragStart(id: string) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id: string, overId: string) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id: string, overId: string) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id: string) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  },
};

export default defaultAnnouncements;
