Проєкт є тестовим завданням: веб-застосунок для бронювання номерів у готелях. 
Користувач може переглядати список готелів, обирати номер, бронювати його на певні дати та переглядати свої бронювання.
Адміністратор може додавати/видаляти/редагувати готелі та номери, а також переглядати статистику по готелям.

**Технології, які використовувались:**
  **Frontend**
  React + TypeScript
  Material UI
  React Query
  React Router DOM
  Axios

  **Backend**
  ASP.NET Core Web API (C#)
  Entity Framework Core
  JWT Authentication
  Cookie
  Dependency inkection

  **Database**
  MySql

**Запуск проєкту**
1. Створити базу даних MySql (скрипт збережений у репозиторії)
2. Відкрити папку Backend у visual studio
3. Задати підключення до бд у файлі appsetings.json:
    "ConnectionStrings":{
       "DefaultConnection": "{ваші дані для підключення}"}
4. Запустити API: dotnet run
   API буде доступне за адресою: "http://localhost:5205"
5. Відкрити папку find_booking_front
6. Встановити залежності: npm install
7. Запустити клієнта: npm run dev
8. Застосунок відкривається за адресою: "http://localhost:5173"
9. Реєстрація/Авторизація користувача створює JWT-токен
10. Токен зберігається в cookie
11. Користувачі мають ролі: 1- Адміністратор, 2- Клієнт.
    Адміністратора можна назначити лише з боку сервера, усі інші користувачі по замовчуванню Клієнти.

**Бізнес логіка backend**
Бізнес логіка міститься окремо від контроллерів. Кожна дія в контролері огорнута в try catch. 
Всередині сервісів також містяться обробки винятків.
Перед створенням бронювання система також перевіряє, чи вільний номер у вибрані дати.
У разі, якщо ні, на стороні клієнта висвічуються повідомлення, про невдалу дії. 

Для автентифікації було використовано JWT -токен та cookie. 
Вони використовується разом, адже JWT з cookie = безпечна SPA-аутентифікація.
Токен зберігається в cookie. Сервер отримує токен автоматично з cookie на кожен запит.
Refresh токен у cookie. Так як JWT зазвичай короткотривалий, а рефреш-токен довший (близько 7 днів).
JWT дозволяє серверу перевіряти токен без збереження сесії, а cookie забезпечує зручну доставку токена на сервер

**Сторінки клієнта та адміністратора**
Клієнт та адміністратор, після авторизації містять різні сторінки та дозволені дії.
В токені зберігається роль користувача, таким чином ми розуміємо, кому яку сторінку варто показати.
Приклад:
  const { Id, RoleId } = useAuth();
  const isAdmin = Number(RoleId) === 1;

  return (
    <Box>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin/bookings" replace />
                ) : (
                  <HotelsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:hotelId/:hotelName/rooms"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin/bookings" replace />
                ) : (
                  <RoomsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <Navigate to="/admin/bookings" replace />
                ) : (
                  <MyBookingsPage />
                )}
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminHotelsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminRoomsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminBookingsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <ProtectedRoute>
                {!isAdmin ? (
                  <Navigate to="/hotels" replace />
                ) : (
                  <AdminStatisticsPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              Id ? (
                <Navigate to={isAdmin ? "/admin/hotels" : "/hotels"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default redirect */}
          <Route
            path="*"
            element={
              Id ? (
                <Navigate to={isAdmin ? "/admin/hotels" : "/hotels"} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>

