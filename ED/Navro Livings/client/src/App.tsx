import { BrowserRouter, Route, Routes } from "react-router-dom";
import { isStaticPreview } from "./api";
import { CartProvider } from "./CartContext";
import { Footer, Header } from "./components";
import {
  AboutPage,
  CartPage,
  CheckoutPage,
  ContactPage,
  HomePage,
  NotFoundPage,
  OrderConfirmationPage,
  PrivacyPage,
  PlantGuideDetailPage,
  PlantGuidePage,
  ProductPage,
  ServiceDetailPage,
  ServicesPage,
  ShopPage,
  TermsPage,
} from "./pages";
import "./styles.css";

function Layout() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    {isStaticPreview && <div className="preview-notice" role="status">Public preview · sample catalogue · enquiries and orders are not collected.</div>}
    <div id="main-content" tabIndex={-1}><Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:slug" element={<ProductPage />} />
      <Route path="/plant-guide" element={<PlantGuidePage />} />
      <Route path="/plant-guide/:slug" element={<PlantGuideDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes></div>
    <Footer />
  </>;
}

export default function App() {
  return <BrowserRouter><CartProvider><Layout /></CartProvider></BrowserRouter>;
}
