import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { DateFilterProvider } from "./context/DateFilterContext";
import { BudgetProvider } from "./context/BudgetContext";

function App() {
  return (
    <AuthProvider>
      <DateFilterProvider>
        <BudgetProvider>
          <AppRoutes />
        </BudgetProvider>
      </DateFilterProvider>
    </AuthProvider>
  );
}

export default App;
