import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Instagram, Leaf, Menu, ShoppingBag, X } from "lucide-react";
import { announcementMessage, imageFallback } from "./content";
import { useCart } from "./CartContext";
import type { PlantGuide, Product } from "./types";

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | NAVRO Living`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
  return null;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  const links = [
    ["Home", "/"],
    ["Services", "/services"],
    ["Shop", "/shop"],
    ["Plant guide", "/plant-guide"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];
  return <>
    <div className="announcement"><span>{announcementMessage}</span><Link to="/contact">Let’s plan a garden <ArrowRight size={13} /></Link></div>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="NAVRO Living home">
          <img src="/navro-logo.png" alt="NAVRO Living" />
        </Link>
        <button className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {links.map(([label, href]) => <NavLink key={href} to={href} end={href === "/"}>{label}</NavLink>)}
          <Link className="cart-link" to="/cart" aria-label={`Shopping bag, ${count} items`}>
            <ShoppingBag size={18} /><span>Bag</span>{count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <Link to="/" className="footer-wordmark">NAVRO <span>Living</span></Link>
        <p>New beginnings. Greener living.<br />Thoughtful gardens for the spaces we call home.</p>
        <a className="social-link" href="https://www.instagram.com/navro_living/" target="_blank" rel="noreferrer"><Instagram size={17} /> @navro_living</a>
      </div>
      <div><h3>Explore</h3><Link to="/services">Our services</Link><Link to="/shop">The shop</Link><Link to="/plant-guide">Plant guide</Link><Link to="/about">Our approach</Link></div>
      <div><h3>Let’s talk</h3><p>Share a little about your space and what you hope to grow.</p><Link className="footer-cta" to="/contact">Start an enquiry <ArrowRight size={15} /></Link><span className="footer-note">Contact details shared soon.</span></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} NAVRO Living</span><span><Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link></span><span>New Beginnings. Greener Living.</span></div>
  </footer>;
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, text, light = false }: { eyebrow?: string; title: string; text?: string; light?: boolean }) {
  return <div className={`section-heading${light ? " section-heading-light" : ""}`}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>;
}

export function Image({ src, alt, className = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  return <img {...props} className={className} src={failed ? imageFallback : src} alt={alt || ""} onError={() => setFailed(true)} />;
}

export function ServiceCard({ service, index = 0 }: { service: { slug: string; title: string; summary: string; image: string; imageAlt: string }; index?: number }) {
  return <article className={`service-card service-card-${index % 3}`}>
    <Link className="service-card-image" to={`/services/${service.slug}`}><Image src={service.image} alt={service.imageAlt} loading="lazy" /><span className="service-image-label">Planting inspiration</span></Link>
    <div className="service-card-copy"><span className="card-number">0{index + 1}</span><h3><Link to={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.summary}</p><Link className="text-link" to={`/services/${service.slug}`}>Explore the service <ArrowRight size={15} /></Link></div>
  </article>;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const unavailable = !product.is_demo && product.stock_quantity < 1;
  return <article className="product-card">
    <Link to={`/shop/${product.slug}`} className="product-image"><Image src={product.image || "/plants.jpg"} alt={product.name} loading="lazy" /><span className="image-category">{product.category}</span></Link>
    <div className="product-card-copy"><Link to={`/shop/${product.slug}`}><h3>{product.name}</h3></Link><span className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</span><span className="product-stock">{product.is_demo ? "Sample listing" : unavailable ? "Out of stock" : "In stock"}</span><button className="small-add" disabled={unavailable} onClick={() => add(product)}>{unavailable ? "Currently unavailable" : product.is_demo ? "Add sample to bag" : "Add to bag"} <ArrowRight size={14} /></button></div>
    {product.is_demo && <span className="demo-label">Sample · not for sale</span>}
  </article>;
}

export function GuideCard({ guide }: { guide: PlantGuide }) {
  return <article className="guide-card">
    <Link to={`/plant-guide/${guide.slug}`} className="guide-image"><Image src={guide.featured_image || "/care.jpg"} alt={guide.featured_image_alt || guide.title} loading="lazy" /></Link>
    <div className="guide-copy"><span className="eyebrow">{guide.category}{guide.is_demo ? " · Sample guide" : ""}</span><h3><Link to={`/plant-guide/${guide.slug}`}>{guide.title}</Link></h3><p>{guide.summary}</p><Link className="text-link" to={`/plant-guide/${guide.slug}`}>Read the guide <ArrowRight size={15} /></Link></div>
  </article>;
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{index > 0 && <span className="breadcrumb-separator">/</span>}{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}

export function Callout({ title = "A little more green starts with a conversation.", text = "Tell us about the space you have in mind. We’ll help you think through a thoughtful next step." }: { title?: string; text?: string }) {
  return <section className="callout"><Container className="callout-inner"><div><span className="eyebrow">Your space, your way</span><h2>{title}</h2><p>{text}</p></div><Link className="button button-light" to="/contact">Plan your garden <ArrowRight size={16} /></Link><Leaf className="callout-leaf" aria-hidden="true" /></Container></section>;
}
