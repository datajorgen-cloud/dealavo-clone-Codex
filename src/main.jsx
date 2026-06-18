import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, ArrowDown, ArrowUp, Bot, CheckCircle2, Database, LineChart, Radar, Settings2, ShieldCheck, Store, Zap } from 'lucide-react';
import './styles.css';

const products = [
  { sku: 'DRN-100', name: 'Drone X100', cost: 410, price: 569, stock: 42, category: 'Electronics', competitors: [{ name: 'MarketHub', price: 559, availability: 'In stock' }, { name: 'MegaShop', price: 589, availability: 'In stock' }, { name: 'DirectCart', price: 544, availability: 'Low stock' }] },
  { sku: 'VAC-220', name: 'Cyclone Vacuum 220', cost: 120, price: 179, stock: 18, category: 'Home', competitors: [{ name: 'MarketHub', price: 184, availability: 'In stock' }, { name: 'MegaShop', price: 169, availability: 'Promo' }, { name: 'DirectCart', price: 177, availability: 'In stock' }] },
  { sku: 'RUN-8', name: 'Runner Pro 8', cost: 52, price: 89, stock: 6, category: 'Sport', competitors: [{ name: 'MarketHub', price: 84, availability: 'In stock' }, { name: 'MegaShop', price: 91, availability: 'In stock' }, { name: 'DirectCart', price: 87, availability: 'In stock' }] },
  { sku: 'BEA-14', name: 'Beauty Set 14', cost: 28, price: 49, stock: 120, category: 'Beauty', competitors: [{ name: 'MarketHub', price: 51, availability: 'In stock' }, { name: 'MegaShop', price: 46, availability: 'Promo' }, { name: 'DirectCart', price: 48, availability: 'In stock' }] },
  { sku: 'KID-77', name: 'Kids Builder Kit', cost: 36, price: 64, stock: 0, category: 'Toys', competitors: [{ name: 'MarketHub', price: 68, availability: 'In stock' }, { name: 'MegaShop', price: 65, availability: 'In stock' }, { name: 'DirectCart', price: 62, availability: 'Low stock' }] }
];

const rules = [
  { name: 'Beat relevant competitor', detail: 'Set 1% below median competitor while preserving floor margin.', status: 'Live' },
  { name: 'Low-stock margin guard', detail: 'Raise target margin by 8 points when stock drops below 10 units.', status: 'Live' },
  { name: 'Promotion detector', detail: 'Flag sudden competitor drops above 7% for review before matching.', status: 'Review' },
  { name: 'Traffic-builder AI', detail: 'Let AI prioritize selected SKUs for volume when margin remains healthy.', status: 'Draft' }
];

function currency(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value); }
function recommendation(product) {
  const prices = product.competitors.map((c) => c.price).sort((a, b) => a - b);
  const median = prices[1];
  const minAllowed = product.cost * 1.22;
  const stockBoost = product.stock < 10 ? 1.06 : 0.99;
  const target = Math.max(minAllowed, median * stockBoost);
  return Math.round(target);
}

function App() {
  const [strategy, setStrategy] = useState('Balanced margin');
  const enriched = useMemo(() => products.map((p) => ({ ...p, suggested: recommendation(p), index: p.price / (p.competitors.reduce((s, c) => s + c.price, 0) / p.competitors.length) })), []);
  const alerts = enriched.filter((p) => Math.abs(p.suggested - p.price) > 4 || p.stock < 10);
  const avgIndex = enriched.reduce((sum, p) => sum + p.index, 0) / enriched.length;
  const marginLift = enriched.reduce((sum, p) => sum + (p.suggested - p.cost) - (p.price - p.cost), 0);

  return <main>
    <section className="hero">
      <nav><div className="brand"><Radar /> PricePilot</div><div className="pill"><ShieldCheck size={16}/> Inhouse deployment</div></nav>
      <div className="heroGrid">
        <div>
          <p className="eyebrow">Competitor monitoring • repricing • market data</p>
          <h1>Own your pricing intelligence instead of renting it.</h1>
          <p className="lede">A Dealavo-style internal service for ecommerce teams: collect competitor prices, match products, monitor availability and promotions, run pricing rules, and publish approved price recommendations to your commerce stack.</p>
          <div className="actions"><button>Connect catalog</button><button className="secondary">Export API spec</button></div>
        </div>
        <div className="panel scorecard"><span>Market price index</span><strong>{avgIndex.toFixed(2)}</strong><p>Your assortment is {(avgIndex * 100 - 100).toFixed(1)}% vs. market average.</p></div>
      </div>
    </section>

    <section className="metrics">
      <Metric icon={<Database/>} label="SKUs monitored" value="24,000" trend="Hourly to daily refresh" />
      <Metric icon={<Store/>} label="Sources" value="30+" trend="Stores, marketplaces, comparison sites" />
      <Metric icon={<Bot/>} label="AI segments" value="3" trend="Traffic builders, potential, long tail" />
      <Metric icon={<Zap/>} label="Projected lift" value={currency(marginLift * 100)} trend="Per 100 units at current mix" />
    </section>

    <section className="workspace">
      <div className="sectionHeader"><div><p className="eyebrow">Live command center</p><h2>Price monitoring dashboard</h2></div><select value={strategy} onChange={(e) => setStrategy(e.target.value)}><option>Balanced margin</option><option>Win buy-box</option><option>Protect premium</option></select></div>
      <div className="table">
        <div className="row head"><span>Product</span><span>Current</span><span>Market range</span><span>AI recommendation</span><span>Action</span></div>
        {enriched.map((p) => <div className="row" key={p.sku}>
          <span><b>{p.name}</b><small>{p.sku} · {p.category}</small></span><span>{currency(p.price)}</span><span>{currency(Math.min(...p.competitors.map(c=>c.price)))}–{currency(Math.max(...p.competitors.map(c=>c.price)))}</span><span className={p.suggested >= p.price ? 'up' : 'down'}>{p.suggested >= p.price ? <ArrowUp size={16}/> : <ArrowDown size={16}/>} {currency(p.suggested)}</span><span><button className="tiny">Approve</button></span>
        </div>)}
      </div>
    </section>

    <section className="grid2">
      <div className="panel"><div className="sectionHeader"><h2>Alert inbox</h2><AlertTriangle/></div>{alerts.map((p) => <div className="alert" key={p.sku}><b>{p.name}</b><span>{p.stock < 10 ? 'Low stock: protect margin' : 'Price delta requires review'}</span></div>)}</div>
      <div className="panel"><div className="sectionHeader"><h2>Automation rules</h2><Settings2/></div>{rules.map((r) => <div className="rule" key={r.name}><CheckCircle2/><div><b>{r.name}</b><p>{r.detail}</p></div><span>{r.status}</span></div>)}</div>
    </section>

    <section className="architecture">
      <p className="eyebrow">Inhouse architecture</p><h2>Built for your existing stack</h2>
      <div className="steps">
        {['Import catalog and costs from ERP/PIM', 'Crawl or ingest competitor offers', 'Match by GTIN, MPN, name and QA rules', 'Detect anomalies, promotions and availability shifts', 'Run rule-based or AI repricing strategies', 'Publish feeds, APIs and audit trails'].map((s, i) => <div className="step" key={s}><LineChart/><b>0{i+1}</b><p>{s}</p></div>)}
      </div>
    </section>
  </main>;
}
function Metric({ icon, label, value, trend }) { return <div className="metric">{icon}<span>{label}</span><strong>{value}</strong><small>{trend}</small></div>; }

createRoot(document.getElementById('root')).render(<App />);
