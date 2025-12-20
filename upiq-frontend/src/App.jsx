import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { DateFilterProvider } from "./context/DateFilterContext";
import { BudgetProvider } from "./context/BudgetContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DateFilterProvider>
          <BudgetProvider>
            <AppRoutes />
          </BudgetProvider>
        </DateFilterProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
