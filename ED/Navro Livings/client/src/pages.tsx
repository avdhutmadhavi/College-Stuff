import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Minus, Plus, Search, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { api, isStaticPreview, type Category } from "./api";
import { useCart } from "./CartContext";
import { homeGuides, services } from "./content";
import { Breadcrumbs, Callout, Container, GuideCard, Image, PageMeta, ProductCard, SectionHeading, ServiceCard } from "./components";
import type { EnquiryPayload, PlantGuide, Product } from "./types";

function LoadingMessage() {
  return <div className="status-message" role="status"><span className="loading-dot" /> Gathering a little green inspiration…</div>;
}

function ErrorMessage({ message }: { message: string }) {
  return <div className="status-message error-message" role="alert">{message}</div>;
}

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [guides, setGuides] = useState<PlantGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([api.products("?limit=3"), api.guides()])
      .then(([productData, guideData]) => {
        if (!active) return;
        setProducts(productData.items.slice(0, 3));
        setGuides(guideData.items.slice(0, 3));
      })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <>
    <PageMeta title="New beginnings. Greener living." description="Thoughtful garden design for balconies, rooftops, and homes. Meet NAVRO Living." />
    <main>
      <section className="hero">
        <Image className="hero-image" src="/balcony.jpg" alt="Close-up of lush fern foliage" />
        <div className="hero-shade" />
        <Container className="hero-content">
          <span className="hero-kicker"><span /> A little closer to nature</span>
          <h1>Room to grow.<br /><em>Space to breathe.</em></h1>
          <p>Thoughtful garden design for the balconies, rooftops, and everyday corners we call home.</p>
          <div className="hero-actions"><Link className="button button-light" to="/services">Explore our services <ArrowRight size={16} /></Link><Link className="button button-outline-light" to="/contact">Plan your garden</Link></div>
          <span className="hero-note">NAVRO Living <span>·</span> New Beginnings. Greener Living.</span>
        </Container>
        <a className="hero-scroll" href="#our-approach">Scroll to explore <span /></a>
      </section>

      <section className="intro-section" id="our-approach"><Container className="intro-grid">
        <div className="intro-marker"><span className="round-mark"><span>N</span></span><span>Growing with intention</span></div>
        <div className="intro-copy"><span className="eyebrow">A little green goes a long way</span><h2>Make space for a <em>new kind of everyday.</em></h2><p>Somewhere to pause between the day and the evening. A few herbs within reach. A balcony that feels like yours. NAVRO Living helps you shape greener spaces around the life you already live.</p><Link className="text-link" to="/about">A little about our approach <ArrowRight size={15} /></Link></div>
        <div className="intro-image"><Image src="/plants.jpg" alt="A small aloe plant in a pale blue-green pot" loading="lazy" /><span>Grow gently, live well.</span></div>
      </Container></section>

      <section className="section services-section"><Container>
        <SectionHeading eyebrow="Thoughtful by nature" title="Find your kind of garden." text="From a little patch of sun to a wide-open terrace, let's make room for something living." />
        <div className="service-grid">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}</div>
        <div className="section-bottom-link"><Link className="text-link" to="/services">Discover all our services <ArrowRight size={15} /></Link></div>
      </Container></section>

      <section className="concept-section"><Container className="concept-inner">
        <div className="concept-copy"><span className="eyebrow">Ideas for the in-between</span><h2>A garden can begin <em>anywhere.</em></h2><p>Not sure what your space could become? Start with a feeling, a patch of light, or the plants you love. These are inspirations, not completed NAVRO Living projects.</p><Link className="button button-dark" to="/contact">Let’s imagine your space <ArrowRight size={16} /></Link></div>
        <div className="concept-collage">
          <figure className="concept-photo concept-photo-one"><Image src="/balcony.jpg" alt="Inspiration: greenery and planters on a balcony" loading="lazy" /><figcaption>Balcony moments <span>Inspiration</span></figcaption></figure>
          <figure className="concept-photo concept-photo-two"><Image src="/rooftop.jpg" alt="Inspiration: young seedlings growing in a tray" loading="lazy" /><figcaption>Small beginnings <span>Inspiration</span></figcaption></figure>
        </div>
      </Container></section>

      <section className="section process-section"><Container>
        <SectionHeading eyebrow="A gentle beginning" title="From first thought to first leaf." text="A clear, considered process keeps the focus on your space and what matters to you." />
        <div className="process-grid">{[
          ["01", "Tell us about it", "Share what you have in mind, what your space is like, and how you hope to use it."],
          ["02", "Explore together", "We talk through the possibilities, practical considerations, and the right next step."],
          ["03", "Shape a plan", "Plant and layout suggestions take their cues from your light, setting, and routine."],
          ["04", "Grow at your pace", "Whether you begin with a single planter or a larger plan, there is room to start simply."],
        ].map(([number, title, text]) => <article className="process-step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </Container></section>

      <section className="why-section"><Container className="why-grid">
        <div className="why-image"><Image src="/care.jpg" alt="Thoughtful hands caring for a home plant" loading="lazy" /><span>Care, considered.</span></div>
        <div className="why-copy"><span className="eyebrow">Growing at your pace</span><h2>Good gardens start with <em>good questions.</em></h2><p>How much sun does your corner get? What feels good to come home to? What fits your day? Our approach starts with the practical details and leaves room for your own way of living.</p>
          <ul className="check-list"><li><Check size={16} /> Ideas shaped around your space</li><li><Check size={16} /> Plant choices guided by growing conditions</li><li><Check size={16} /> A thoughtful, step-by-step beginning</li></ul>
          <Link className="text-link" to="/services">Get to know our services <ArrowRight size={15} /></Link>
        </div>
      </Container></section>

      <section className="section shop-section"><Container>
        <div className="section-title-row"><SectionHeading eyebrow="A few good things" title="Little things to help you grow." text="Explore the sample catalogue. Product details, prices, and availability are for demonstration only." /><Link className="text-link" to="/shop">Visit the shop <ArrowRight size={15} /></Link></div>
        {loading ? <LoadingMessage /> : error ? <ErrorMessage message={`${error} The sample catalogue appears once the database has been set up.`} /> : products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <div className="empty-state"><ShoppingBag size={24} /><p>No products to show yet. Our sample catalogue can be added during setup.</p></div>}
      </Container></section>

      <section className="guides-section"><Container>
        <div className="section-title-row"><SectionHeading eyebrow="The growing notes" title="A little know-how, when you need it." text="Gentle starting points for finding your way with plants." /><Link className="text-link" to="/plant-guide">Browse the plant guide <ArrowRight size={15} /></Link></div>
        {error ? <p className="subtle-note">Plant guides will appear when the database is ready.</p> : guides.length > 0
          ? <div className="guide-grid">{guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}</div>
          : <div className="guide-grid">{homeGuides.map((guide) => <article className="guide-card guide-card-static" key={guide.title}><div className="guide-image"><Image src={guide.image} alt="" loading="lazy" /></div><div className="guide-copy"><span className="eyebrow">{guide.category}</span><h3>{guide.title}</h3><p>A small-space growing note from the NAVRO Living team.</p><Link className="text-link" to="/plant-guide">Explore the guide <ArrowRight size={15} /></Link></div></article>)}</div>}
      </Container></section>

      <section className="instagram-strip"><Container><span className="instagram-mark">✳</span><div><span className="eyebrow">Follow along, grow along</span><h2>A little more green in your feed.</h2><p>Find NAVRO Living on Instagram for plant notes and everyday inspiration.</p></div><a className="button button-outline" href="https://www.instagram.com/navro_living/" target="_blank" rel="noreferrer">Follow @navro_living <ArrowRight size={15} /></a></Container></section>
      <Callout />
    </main>
  </>;
}

export function ServicesPage() {
  return <>
    <PageMeta title="Garden design & care services" description="Explore NAVRO Living services for balconies, rooftops, home gardens, and ongoing plant care." />
    <main><section className="page-hero page-hero-services"><Image src="/balcony.jpg" alt="Lush green fern foliage as planting inspiration" /><div className="page-hero-shade" /><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Services" }]} /><span className="eyebrow">Thoughtful spaces, grown with care</span><h1>Let’s find your <em>kind of green.</em></h1><p>Garden ideas shaped around the light you have, the space you live in, and the way you want to feel in it.</p></Container></section>
      <section className="section"><Container><div className="services-intro"><SectionHeading eyebrow="Explore what’s possible" title="A good place to begin." text="Every space is different. These services are starting points for a conversation about yours." /><p>Tell us a little about what you have in mind, and we can talk through a considered next step. You do not need to have everything figured out before you reach out.</p></div><div className="service-grid service-grid-large">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}</div>
        <div className="service-extra"><div><span className="eyebrow">Made for your space</span><h2>Plant selection &amp; garden essentials</h2><p>Thoughtful help choosing plants, containers, and simple gardening kits to suit your growing conditions and the space you have.</p></div><Link className="button button-dark" to="/contact?service=Plant%20selection">Ask about plant selection <ArrowRight size={16} /></Link></div>
        <div className="service-extra service-extra-sage"><div><span className="eyebrow">A good plan, well begun</span><h2>Garden installation</h2><p>Installation planning and hands-on support can be discussed once we understand your space and the scope. Specialist construction, waterproofing, and structural work require qualified professionals.</p></div><Link className="button button-outline" to="/contact?service=Garden%20installation">Talk through an installation <ArrowRight size={16} /></Link></div>
      </Container></section><Callout /></main>
  </>;
}

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = services.find((item) => item.slug === slug);
  if (!service) return <NotFoundPage />;
  return <>
    <PageMeta title={service.title} description={service.summary} />
    <main><section className="detail-hero"><div className="detail-hero-photo"><Image src={service.image} alt={service.imageAlt} /></div><Container className="detail-hero-inner"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: service.title }]} /><div className="detail-hero-copy"><span className="eyebrow">{service.eyebrow}</span><h1>{service.title}<em>, thoughtfully.</em></h1><p>{service.summary}</p><Link className="button button-dark" to={`/contact?service=${encodeURIComponent(service.title)}`}>Enquire about this service <ArrowRight size={16} /></Link></div></Container></section>
      <section className="section"><Container className="detail-body-grid"><div><span className="eyebrow">A good fit for</span><h2>Make it work for <em>your everyday.</em></h2><p>{service.suitable}</p></div><div><span className="eyebrow">A considered starting point</span><h2>What we can explore.</h2><ul className="check-list detail-check-list">{service.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><div className="consideration"><ShieldCheck size={18} /><p>{service.considerations}</p></div></div></Container></section>
      <section className="process-band"><Container><SectionHeading eyebrow="How it takes shape" title="A little at a time." /><div className="process-grid">{["Start with your space", "Talk through the details", "Shape a considered plan", "Grow at a comfortable pace"].map((item, index) => <article className="process-step" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>We begin with a conversation, so each next step makes sense for you.</p></article>)}</div></Container></section>
      <section className="faq-section"><Container><SectionHeading eyebrow="A few things you might wonder" title="Good questions to start with." /><div className="faq-list">{service.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</div></Container></section>
      <Callout title={`Let’s talk about your ${service.title.toLowerCase()}.`} text="Tell us what you’re working with and what you hope it could become." /></main>
  </>;
}

export function AboutPage() {
  return <>
    <PageMeta title="About NAVRO Living" description="Discover NAVRO Living's approach to making greener everyday spaces feel possible." />
    <main><section className="page-hero page-hero-about"><Image src="/balcony.jpg" alt="Close-up of leafy green ferns" /><div className="page-hero-shade" /><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} /><span className="eyebrow">New beginnings. Greener living.</span><h1>Make room for <em>a little more life.</em></h1><p>NAVRO Living is for people who want to bring more green into the places they already call home.</p></Container></section>
      <section className="section about-story"><Container className="about-grid"><div><span className="eyebrow">Our point of view</span><h2>Good green living feels <em>like it belongs.</em></h2></div><div><p>We believe a garden does not have to begin with a big space or a perfect plan. It might be one pot that catches the morning light, a corner that makes room to pause, or a terrace shaped around slow evenings.</p><p>NAVRO Living brings thoughtful garden design and practical plant care together, with each idea grounded in the conditions of your space and the way you live.</p><p>Start small, ask a few good questions, and let your space grow into itself.</p><Link className="text-link" to="/contact">Tell us what you have in mind <ArrowRight size={15} /></Link></div></Container></section>
      <section className="about-image-band"><Image src="/balcony.jpg" alt="A relaxed green balcony with comfortable seating" loading="lazy" /><div><span className="eyebrow">A simple idea, with room to grow</span><h2>Greener living can start right where you are.</h2></div></section>
      <section className="section"><Container><SectionHeading eyebrow="What guides us" title="Care for the space. Respect for the details." /><div className="values-grid"><article><span>01</span><h3>Start by listening</h3><p>Your needs, routines, and hopes are part of the garden plan.</p></article><article><span>02</span><h3>Let the conditions lead</h3><p>Light, climate, wind, and room help guide what will work.</p></article><article><span>03</span><h3>Keep it thoughtful</h3><p>A considered beginning matters more than an overwhelming one.</p></article></div></Container></section><Callout /></main>
  </>;
}

const emptyEnquiry: EnquiryPayload = {
  name: "", email: "", phone: "", service: "", locality: "", gardenType: "",
  gardenSize: "", budget: "", contactMethod: "No preference", message: "", consent: false,
};

export function ContactPage() {
  const location = useLocation();
  const suggestedService = new URLSearchParams(location.search).get("service") || "";
  const [form, setForm] = useState({ ...emptyEnquiry, service: suggestedService });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const update = (field: keyof EnquiryPayload, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const result = await api.submitEnquiry(form);
      setSuccess(`${result.message} Reference ${result.id}.`);
      setForm({ ...emptyEnquiry, service: suggestedService });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your enquiry could not be sent.");
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageMeta title="Contact & garden enquiries" description="Tell NAVRO Living about your balcony, rooftop, or home garden plans." />
    <main><section className="page-hero page-hero-contact"><Image src="/rooftop.jpg" alt="Young seedlings in a growing tray" /><div className="page-hero-shade" /><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} /><span className="eyebrow">A good thing starts somewhere</span><h1>Tell us what <em>you’re growing toward.</em></h1><p>A few details help us understand your space and the kind of help you have in mind.</p></Container></section>
      <section className="section contact-section"><Container className="contact-grid"><div className="contact-aside"><span className="eyebrow">A note to NAVRO Living</span><h2>There’s no wrong place to <em>begin.</em></h2><p>Share what you can. If something is still taking shape, that’s all right too.</p><div className="contact-note"><span>01</span><p>We’ll use your details to respond to this enquiry. Please avoid including sensitive personal information.</p></div><div className="contact-note"><span>02</span><p>Contact and business details will be added once verified.</p></div></div>
        {isStaticPreview ? <div className="form-card preview-action-card" role="note"><span className="eyebrow">Public preview</span><h2>Enquiries aren’t enabled here.</h2><p>This preview does not send or store messages. Please don’t enter personal details. Verified contact information will be added before enquiries are enabled.</p></div> : <form className="form-card enquiry-form" onSubmit={submit}>
          <div className="form-heading"><span className="eyebrow">Your garden enquiry</span><h2>A few details, then we’ll take it from there.</h2><p>Fields marked with * are required.</p></div>
          {error && <div className="form-alert form-alert-error" role="alert">{error}</div>}
          {success && <div className="form-alert form-alert-success" role="status"><Check size={18} />{success}</div>}
          <div className="form-row"><label>Your name *<input name="name" autoComplete="name" required minLength={2} maxLength={120} value={form.name} onChange={(event) => update("name", event.target.value)} /></label><label>Email address *<input name="email" autoComplete="email" type="email" required value={form.email} onChange={(event) => update("email", event.target.value)} /></label></div>
          <div className="form-row"><label>Phone number<input name="phone" autoComplete="tel" type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label><label>Service of interest<select value={form.service} onChange={(event) => update("service", event.target.value)}><option value="">Choose if you know</option>{services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}<option value="Plant selection">Plant selection</option><option value="Garden installation">Garden installation</option><option value="Not sure yet">Not sure yet</option></select></label></div>
          <div className="form-row"><label>City or locality<input name="locality" autoComplete="address-level2" value={form.locality} onChange={(event) => update("locality", event.target.value)} /></label><label>Garden type<select value={form.gardenType} onChange={(event) => update("gardenType", event.target.value)}><option value="">Choose if relevant</option><option>Balcony</option><option>Rooftop or terrace</option><option>Kitchen garden</option><option>Indoor plants</option><option>Other</option></select></label></div>
          <div className="form-row"><label>Approximate space size<input placeholder="e.g. a compact balcony" value={form.gardenSize} onChange={(event) => update("gardenSize", event.target.value)} /></label><label>Budget range (optional)<input placeholder="A broad estimate is fine" value={form.budget} onChange={(event) => update("budget", event.target.value)} /></label></div>
          <label>Preferred way to hear back<select value={form.contactMethod} onChange={(event) => update("contactMethod", event.target.value)}><option>No preference</option><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label>
          <label>What are you imagining? *<textarea required minLength={10} maxLength={4000} rows={5} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us a little about the space, the light, or the garden you have in mind." /></label>
          <label className="checkbox-label"><input type="checkbox" required checked={form.consent} onChange={(event) => update("consent", event.target.checked)} /><span>I agree that NAVRO Living may use my information to respond to this enquiry. *</span></label>
          <button className="button button-dark form-submit" type="submit" disabled={busy}>{busy ? "Sending your enquiry…" : "Send your enquiry"} <ArrowRight size={16} /></button>
          <p className="privacy-note">We only use your details to follow up about this enquiry.</p>
        </form>}</Container></section></main>
  </>;
}

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  useEffect(() => {
    api.categories().then(setCategories).catch((reason: Error) => setError(reason.message));
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "12");
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (sort !== "name") params.set("sort", sort);
    let active = true;
    setLoading(true);
    setError("");
    api.products(`?${params}`).then((result) => {
      if (!active) return;
      setProducts((current) => page === 1 ? result.items : [...current, ...result.items]);
      setTotal(result.total);
    })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, category, sort, page]);
  return <>
    <PageMeta title="The NAVRO Living shop" description="Browse the NAVRO Living sample catalogue of plants, garden kits, and small-space essentials." />
    <main><section className="page-hero page-hero-shop"><Image src="/plants.jpg" alt="A small potted succulent" /><div className="page-hero-shade" /><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop" }]} /><span className="eyebrow">A few good things</span><h1>Little things to help <em>you grow.</em></h1><p>Explore a sample catalogue of thoughtful garden essentials.</p></Container></section>
      <section className="section shop-page-section"><Container><div className="demo-banner"><span className="demo-banner-mark">i</span><p><strong>Demonstration catalogue.</strong> Products, prices, images, and stock here are samples for preview only—not real inventory and not available to purchase. Current products and prices will be added once confirmed.</p></div>
        <div className="shop-controls"><label className="search-field"><Search size={17} /><span className="sr-only">Search products</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search the sample catalogue" /></label><label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="">All categories</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label><label>Sort by<select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="name">Name</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>
        {loading && products.length === 0 ? <LoadingMessage /> : error ? <ErrorMessage message={error} /> : products.length ? <><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div><div className="pagination-row"><span>Showing {products.length} of {total} products</span>{products.length < total && <button className="button button-outline" onClick={() => setPage((current) => current + 1)} disabled={loading}>{loading ? "Loading…" : "Load more"}</button>}</div></> : <div className="empty-state"><ShoppingBag size={24} /><p>No sample products match that search.</p><button className="text-link" onClick={() => { setSearch(""); setCategory(""); setPage(1); }}>Clear filters <ArrowRight size={15} /></button></div>}
      </Container></section></main>
  </>;
}

export function ProductPage() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { add } = useCart();
  const unavailable = product ? !product.is_demo && product.stock_quantity < 1 : false;
  useEffect(() => {
    let active = true;
    api.product(slug).then((data) => { if (active) setProduct(data); })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  if (loading) return <main className="section"><Container><LoadingMessage /></Container></main>;
  if (error || !product) return <main className="section"><Container><ErrorMessage message={error || "This product could not be found."} /><Link className="text-link" to="/shop">Back to the shop <ArrowRight size={15} /></Link></Container></main>;
  return <>
    <PageMeta title={product.name} description={product.description} />
    <main className="section product-detail-section"><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: product.name }]} /><div className="product-detail-grid"><div className="product-detail-image"><Image src={product.images?.[0]?.image_url || product.image || "/plants.jpg"} alt={product.images?.[0]?.alt_text || product.name} /></div><div className="product-detail-copy"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p className="detail-price">₹{Number(product.price).toLocaleString("en-IN")}</p><p>{product.description}</p>{product.care_instructions && <div className="care-tip"><span className="eyebrow">A care note</span><p>{product.care_instructions}</p></div>}<p className="stock-note">{product.is_demo ? "Sample listing · not available to purchase" : unavailable ? "Currently unavailable" : `${product.stock_quantity} in stock`}</p><button className="button button-dark" disabled={unavailable} onClick={() => add(product)}>{unavailable ? "Currently unavailable" : product.is_demo ? "Add sample to bag" : "Add to bag"} <ShoppingBag size={17} /></button><p className="detail-disclaimer">Sample catalogue item. Adding it to your bag is for demonstration only.</p></div></div></Container></main>
  </>;
}

export function PlantGuidePage() {
  const [guides, setGuides] = useState<PlantGuide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    api.guideCategories().then(setCategories).catch((reason: Error) => setError(reason.message));
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(page === 1 || guides.length === 0);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    api.guides(`?${params}`).then((result) => {
      if (!active) return;
      setGuides((current) => page === 1 ? result.items : [...current, ...result.items]);
      setTotal(result.total);
    })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, category, page]);
  return <>
    <PageMeta title="Plant guide & growing notes" description="Explore practical starting points for balcony gardens, kitchen herbs, and caring for plants at home." />
    <main><section className="page-hero page-hero-guides"><Image src="/care.jpg" alt="Hands tending to a home-grown plant" /><div className="page-hero-shade" /><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Plant guide" }]} /><span className="eyebrow">The growing notes</span><h1>Learn as you <em>grow along.</em></h1><p>Small, practical starting points for greener corners at home.</p></Container></section>
      <section className="section"><Container><div className="guide-search-intro"><SectionHeading eyebrow="A little know-how" title="Find a note for your next step." text="Plant needs vary with local climate, light, and growing conditions. Use these guides as a starting point for learning about your own space." /><div className="guide-filters"><label className="search-field"><Search size={17} /><span className="sr-only">Search plant guides</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search growing notes" /></label><label className="guide-category-filter"><span className="sr-only">Filter by guide category</span><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="">All topics</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label></div></div>{loading && guides.length === 0 ? <LoadingMessage /> : error ? <ErrorMessage message={error} /> : guides.length ? <><div className="guide-grid guide-grid-large">{guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}</div><div className="pagination-row"><span>Showing {guides.length} of {total} growing notes</span>{guides.length < total && <button className="button button-outline" onClick={() => setPage((current) => current + 1)} disabled={loading}>{loading ? "Loading…" : "Load more"}</button>}</div></> : <div className="empty-state"><p>No growing notes found. Try another search.</p></div>}</Container></section><Callout /></main>
  </>;
}

export function PlantGuideDetailPage() {
  const { slug = "" } = useParams();
  const [guide, setGuide] = useState<PlantGuide | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api.guide(slug).then(setGuide).catch((reason: Error) => setError(reason.message)); }, [slug]);
  if (error) return <main className="section"><Container><ErrorMessage message={error} /><Link className="text-link" to="/plant-guide">Back to the plant guide <ArrowRight size={15} /></Link></Container></main>;
  if (!guide) return <main className="section"><Container><LoadingMessage /></Container></main>;
  return <>
    <PageMeta title={guide.title} description={guide.summary} />
    <main className="article-page"><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Plant guide", to: "/plant-guide" }, { label: guide.title }]} /><article className="guide-article"><Image className="article-hero-image" src={guide.featured_image || "/care.jpg"} alt={guide.featured_image_alt || guide.title} /><span className="eyebrow">{guide.category}{guide.is_demo ? " · Sample guide" : ""}</span><h1>{guide.title}</h1><p className="article-summary">{guide.summary}</p>{guide.content?.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}<p className="article-note">Growing advice can vary with species, local climate, season, and the conditions in your space. Observe your plants and adapt care to what they need.</p><Link className="text-link" to="/plant-guide"><ArrowLeft size={15} /> Back to all growing notes</Link></article></Container></main>
  </>;
}

export function CartPage() {
  const { items, subtotal, setQuantity, remove } = useCart();
  const unavailableItems = items.filter(({ product, quantity }) => !product.is_demo && product.stock_quantity < quantity);
  return <>
    <PageMeta title="Your garden bag" description="Review the sample products in your NAVRO Living bag." />
    <main className="section cart-page"><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Your bag" }]} /><SectionHeading eyebrow="Your garden bag" title="A few good things." text="Your bag is saved in this browser. Demo items are samples and cannot be purchased." />
      {!items.length ? <div className="empty-state cart-empty"><ShoppingBag size={32} /><h2>Your bag is taking a little breather.</h2><p>Have a look through the sample catalogue and add something that catches your eye.</p><Link className="button button-dark" to="/shop">Explore the sample shop <ArrowRight size={16} /></Link></div>
        : <div className="cart-layout"><div className="cart-items">{items.map(({ product, quantity }) => <article className="cart-item" key={product.id}><Link className="cart-item-image" to={`/shop/${product.slug}`}><Image src={product.image || product.images?.[0]?.image_url || "/plants.jpg"} alt={product.name} /></Link><div className="cart-item-copy"><span className="eyebrow">{product.category}</span><h3><Link to={`/shop/${product.slug}`}>{product.name}</Link></h3>{product.is_demo ? <span className="demo-inline">Sample · not for sale</span> : product.stock_quantity < quantity && <span className="stock-warning">{product.stock_quantity > 0 ? `Only ${product.stock_quantity} in stock` : "Currently unavailable"}</span>}<span>₹{Number(product.price).toLocaleString("en-IN")}</span><div className="quantity-control"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={14} /></button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={14} /></button></div></div><div className="cart-item-trailing"><strong>₹{(Number(product.price) * quantity).toLocaleString("en-IN")}</strong><button className="remove-item" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={17} /> Remove</button></div></article>)}</div>
          <aside className="cart-summary"><span className="eyebrow">A little summary</span><h2>Your bag</h2><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div><p>Delivery and taxes, if applicable, will be confirmed once real products and delivery details are available.</p><p className="cart-pending-note">Demonstration products are not available for purchase. No payment is collected.</p>{unavailableItems.length > 0 ? <button className="button button-dark" disabled>Review unavailable items</button> : <Link className="button button-dark" to="/checkout">Continue to checkout <ArrowRight size={16} /></Link>}<Link className="text-link" to="/shop">Keep exploring <ArrowRight size={15} /></Link></aside></div>}
    </Container></main>
  </>;
}

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hasDemoItems = items.some((item) => item.product.is_demo);
  const hasUnavailableItems = items.some(({ product, quantity }) => !product.is_demo && product.stock_quantity < quantity);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });
  if (!items.length) return <main className="section"><Container><div className="empty-state"><h2>Your bag is empty.</h2><Link className="button button-dark" to="/shop">Visit the sample shop <ArrowRight size={16} /></Link></div></Container></main>;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await api.createOrder({
        ...form,
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      });
      clear();
      navigate("/order-confirmation", { state: { order } });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The order could not be created.");
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageMeta title="Checkout" description="Review your order request and delivery details." />
    <main className="section checkout-page"><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Your bag", to: "/cart" }, { label: "Checkout" }]} /><div className="checkout-title"><span className="eyebrow">A little more detail</span><h1>Delivery details.</h1><p>This checkout is a foundation for future orders. No payment is collected.</p></div><div className="checkout-layout">{isStaticPreview ? <div className="form-card preview-action-card" role="note"><span className="eyebrow">Public preview</span><h2>Checkout isn’t enabled here.</h2><p>This catalogue is for demonstration only. No orders or personal details are accepted or stored.</p></div> : <form className="form-card checkout-form" onSubmit={submit}><h2>Where should we send things?</h2>{error && <div className="form-alert form-alert-error" role="alert">{error}</div>}{hasDemoItems && <div className="form-alert form-alert-warning">Your bag contains demonstration products. They cannot be ordered until real items, prices, and stock are configured.</div>}{hasUnavailableItems && <div className="form-alert form-alert-warning">One or more real products no longer have enough stock for this quantity. Update your bag before continuing.</div>}<label>Full name *<input autoComplete="name" required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><div className="form-row"><label>Email *<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Phone *<input type="tel" autoComplete="tel" required minLength={7} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label></div><label>Delivery address *<textarea autoComplete="street-address" required minLength={8} rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label><div className="form-row"><label>City *<input autoComplete="address-level2" required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label><label>Postal code *<input autoComplete="postal-code" required value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} /></label></div><button className="button button-dark form-submit" disabled={busy || hasDemoItems || hasUnavailableItems}>{busy ? "Submitting order request…" : "Submit order request"} <ArrowRight size={16} /></button><p className="privacy-note">No payment details are requested or stored. A submitted request remains pending until payment is configured.</p></form>}
          <aside className="cart-summary checkout-summary"><span className="eyebrow">Order summary</span><h2>Your selection</h2>{items.map(({ product, quantity }) => <div className="summary-line" key={product.id}><span>{product.name} × {quantity}{product.is_demo ? " · sample" : ""}</span><strong>₹{(Number(product.price) * quantity).toLocaleString("en-IN")}</strong></div>)}<div className="summary-total"><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div><p className="cart-pending-note">Server recalculates prices from the catalogue. This is not a completed sale.</p></aside></div></Container></main>
  </>;
}

export function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order as { id: number; total: number; paymentStatus: string } | undefined;
  return <>
    <PageMeta title="Order request" description="Review the status of your NAVRO Living order request." />
    <main className="section confirmation-section"><Container><div className="confirmation-card"><span className="confirmation-icon"><Check size={25} /></span><span className="eyebrow">Order request</span><h1>{order ? "Your request is with us." : "No order details found."}</h1>{order ? <><p>Request #{order.id} has been recorded with a total of ₹{Number(order.total).toLocaleString("en-IN")} and is pending payment.</p><div className="form-alert form-alert-warning">No payment has been processed. We’ll confirm availability and payment arrangements once real products and a payment provider are configured.</div></> : <p>You can review your bag or return to the shop.</p>}<Link className="button button-dark" to="/shop">Back to the shop <ArrowRight size={16} /></Link></div></Container></main>
  </>;
}

export function PrivacyPage() {
  return <>
    <PageMeta title="Privacy notice" description="Learn how NAVRO Living handles information submitted through this website." />
    <main className="section legal-page"><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy" }]} /><article><span className="eyebrow">A clear note about your details</span><h1>Privacy notice.</h1><p>This is a development-stage privacy notice for the NAVRO Living website. The public preview uses bundled sample catalogue data only; its enquiry and checkout forms are disabled, and it does not collect or store personal details. This notice must be reviewed and completed with the business's verified contact details, legal requirements, and retention practices before interactive forms are enabled.</p><h2>Information you submit</h2><p>The public preview does not accept enquiries or orders. In the separately configured local application, an enquiry can collect contact and garden details, and an order request can collect delivery information. Do not enter personal information into this public demonstration.</p><h2>How information is used</h2><p>No visitor-submitted information is stored by the public preview. The local application stores enquiries and pending order requests in its configured NAVRO Living MySQL database. No payment-card details are requested or stored by this application.</p><h2>Storage and access</h2><p>The public preview has no connected application database. In a deployed application, database access must be restricted to authorized operators, protected using a dedicated application account, and secured in production. This starter version does not provide an admin dashboard, a customer account system, or an automated data-retention and deletion workflow.</p><h2>Questions or requests</h2><p>Verified business contact details have not yet been supplied. Add a monitored contact address and an appropriate privacy contact before enabling public enquiries so visitors can ask questions about their information or request its deletion.</p><h2>Before public launch</h2><p>Confirm the data controller, lawful basis, retention period, deletion process, service providers, hosting locations, and any notices required for the regions where the business operates. This template is informational and is not legal advice.</p><Link className="text-link" to="/contact">Contact NAVRO Living <ArrowRight size={15} /></Link></article></Container></main>
  </>;
}

export function TermsPage() {
  return <>
    <PageMeta title="Website terms" description="Read the NAVRO Living website's demonstration-stage terms and limitations." />
    <main className="section legal-page"><Container><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms" }]} /><article><span className="eyebrow">A few things worth knowing</span><h1>Website terms.</h1><p>These development-stage terms describe the current demonstration website. They need review and business-specific details before public launch and do not create an agreement for services or a product sale.</p><h2>Services and enquiries</h2><p>Sending an enquiry is a request to start a conversation, not a confirmed booking, quotation, or guarantee of availability. Any services, scope, timing, and costs must be agreed separately with NAVRO Living.</p><h2>Sample catalogue and payment</h2><p>Products, images, prices, and availability in the demonstration catalogue are examples only, are not real inventory, and are not offered for sale. Demo products cannot be ordered. The checkout foundation is not connected to a payment provider, and no payment is collected or processed.</p><h2>Plant and garden information</h2><p>General growing information is a starting point, not advice that fits every species or setting. Plant needs vary with local climate, season, light, and growing conditions. Structural safety, waterproofing, drainage, building approvals, and engineering work must be assessed by appropriately qualified professionals.</p><h2>Accuracy and updates</h2><p>Confirm all business information, service availability, real products and prices, consumer rights, and governing terms before accepting orders or public enquiries. No business address, telephone number, certifications, project history, or guarantees are claimed by this starter site.</p><Link className="text-link" to="/contact">Start an enquiry <ArrowRight size={15} /></Link></article></Container></main>
  </>;
}

export function NotFoundPage() {
  return <main className="section not-found"><Container><span className="eyebrow">A small detour</span><h1>This little path ends here.</h1><p>That page may have moved, or it may not be part of our garden just yet.</p><Link className="button button-dark" to="/">Return home <ArrowRight size={16} /></Link></Container></main>;
}
