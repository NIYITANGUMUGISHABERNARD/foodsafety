import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Batches from "./pages/Batches";
import Storage from "./pages/Storage";
import Inspections from "./pages/Inspections";
import Risk from "./pages/Risk";
import Alerts from "./pages/Alerts";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Products />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Categories />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Users />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/batches"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Batches />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/storage"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Storage />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/inspections"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Inspections />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/risk"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Risk />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/alerts"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Alerts />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
