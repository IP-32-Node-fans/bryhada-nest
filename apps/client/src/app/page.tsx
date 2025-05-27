
export default function Home() {
  return (
    <main className="flex-auto">
      <div className="container header-container">
        <h1>Ip 32 <br />node <br />fans</h1>
        <p>
          Ми – 2а бригада потоку ІП з дисципліни &quot;Основи розроблення ПЗ на
          платформі Node.js&quot;.
          <br />
          <br />Пишемо код, дебажимо, ламаємо сервери... і знову все
          виправляємо!
        </p>
      </div>
      <section>
        <div className="container team-container">
          <h2>Наша бригада</h2>
          <h3>Дізнайтеся, хто стоїть за IP-32 Node Fans!</h3>
          <div className="team-cards-container">
            <div className="team-card">
              <div className="card-image oleh-card"></div>
              <h4>Запара Олег</h4>
              <a href="/about?name=oleh" className="button">Дізнатися більше</a>
            </div>
            <div className="team-card">
              <div className="card-image kyrylo-card"></div>
              <h4>Галямов Кирило</h4>
              <a href="/about?name=kyrylo" className="button">Дізнатися більше</a>
            </div>
            <div className="team-card">
              <div className="card-image nata-card"></div>
              <h4>Гаращук Наталія</h4>
              <a href="/about?name=nata" className="button">Дізнатися більше</a>
            </div>
            <div className="team-card">
              <div className="card-image arthur-card"></div>
              <h4>Серкелі Артур</h4>
              <a href="/about?name=arthur" className="button">Дізнатися більше</a>
            </div>
            <div className="team-card">
              <div className="card-image andrew-card"></div>
              <h4>Пасюра Андрій</h4>
              <a href="/about?name=andrew" className="button">Дізнатися більше</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
