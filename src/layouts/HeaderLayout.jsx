import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { useSelector } from "react-redux";
import AddModal from "../components/addModal/AddModal";
import CalendarWithEvents from "../components/calendar/Calendar";

const HeaderLayout = () => {
  const items = useSelector((state) => state.updateNoteItems.item);
  const calendarState = useSelector(
    (state) => state.toggleCalendar.calendarState
  );
  const addFormToggleState = useSelector(
    (state) => state.toggleAddForm.addFormStage
  );
  return (
    <>
      <div className={`${addFormToggleState.state && 'bg-stone-500 blur-md opacity-50 h-full'} ${calendarState && 'bg-stone-500 blur-md opacity-50 h-full'}`}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      {addFormToggleState.state && (
        <AddModal />
      )}
      {calendarState && <CalendarWithEvents noteItems={items} />}
    </>
  );
};

export default HeaderLayout;
