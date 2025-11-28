import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import PhoneModal from "./Components/PhoneModal/PhoneModal"; // nhớ đúng đường dẫn
import { useCart } from "./Context/CartContext";

export default function App() {
    const { needPhoneModal, confirmPhone, closePhoneModal } = useCart();

    return (
        <>
            {/* MODAL NHẬP SỐ ĐIỆN THOẠI */}
            <PhoneModal
                open={needPhoneModal}
                onSubmit={confirmPhone}
                onCancel={closePhoneModal}
            />

            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
