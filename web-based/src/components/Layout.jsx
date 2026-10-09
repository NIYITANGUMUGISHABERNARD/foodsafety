import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

function Layout({ children }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50 min-h-screen">
                {children}
            </div>
            <Chatbot />
        </div>
    );
}

export default Layout;
