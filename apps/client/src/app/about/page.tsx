"use client"
import { bryhada } from "@/lib/memberData";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./style.css"

const AboutPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  if (!name) {
    return <div>Member not found</div>;
  }
  const member = bryhada.find(
    (x) => x.name.toLowerCase() === name.toLowerCase()
  );
  if (!member) {
    return <div>Member not found</div>;
  }
  return (
    <>
      <main className="about-main flex-auto min-h-screen">
        <div className="panel text">
          <h1 className="name">{member.fullname}</h1>
          <h2 className="role">{member.role}</h2>
          <div className="skill-list">
            <div className="skills-title">My skills:</div>
            {member.skills.map((skill, idx) => (
              <div className="skill" key={idx}>{skill}</div>
            ))}
          </div>
          <div className="social-links">
            <Link href={member.github} className="social-link github">
              Github <Image className="social" src="/images/github.png" alt="Github" width={20} height={20} />
            </Link>
            <Link href={member.instagram} className="social-link instagram">
              Instagram <Image className="social" src="/images/instagram.png" alt="Instagram" width={20} height={20} />
            </Link>
          </div>
        </div>
        <div className="panel">
          <div className="image-container">
            <div className="ripple"></div>
            <Image src={member.imageUrl} alt={name} className="image aspect-square" width={300} height={300} />
          </div>
        </div>
      </main>
      <div className="absolute top-0 left-0 w-full z-0">
        <svg
          viewBox="0 0 960 540"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 41L8.5 41.5C17 42 34 43 50.8 38.2C67.7 33.3 84.3 22.7 101.2 17.3C118 12 135 12 151.8 11.3C168.7 10.7 185.3 9.3 202.2 13.5C219 17.7 236 27.3 252.8 29.8C269.7 32.3 286.3 27.7 303.2 24.5C320 21.3 337 19.7 353.8 21.8C370.7 24 387.3 30 404.2 34.7C421 39.3 438 42.7 454.8 39C471.7 35.3 488.3 24.7 505.2 20.2C522 15.7 539 17.3 555.8 18C572.7 18.7 589.3 18.3 606.2 21.5C623 24.7 640 31.3 656.8 33.7C673.7 36 690.3 34 707.2 31.8C724 29.7 741 27.3 757.8 25.7C774.7 24 791.3 23 808.2 21.2C825 19.3 842 16.7 858.8 20.5C875.7 24.3 892.3 34.7 909.2 34.7C926 34.7 943 24.3 951.5 19.2L960 14L960 0L951.5 0C943 0 926 0 909.2 0C892.3 0 875.7 0 858.8 0C842 0 825 0 808.2 0C791.3 0 774.7 0 757.8 0C741 0 724 0 707.2 0C690.3 0 673.7 0 656.8 0C640 0 623 0 606.2 0C589.3 0 572.7 0 555.8 0C539 0 522 0 505.2 0C488.3 0 471.7 0 454.8 0C438 0 421 0 404.2 0C387.3 0 370.7 0 353.8 0C337 0 320 0 303.2 0C286.3 0 269.7 0 252.8 0C236 0 219 0 202.2 0C185.3 0 168.7 0 151.8 0C135 0 118 0 101.2 0C84.3 0 67.7 0 50.8 0C34 0 17 0 8.5 0L0 0Z"
            fill={'var(--secondary)'}
            strokeLinecap="round"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          viewBox="0 0 960 540"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 523L8.5 520C17 517 34 511 50.8 512.5C67.7 514 84.3 523 101.2 524.8C118 526.7 135 521.3 151.8 515.5C168.7 509.7 185.3 503.3 202.2 504C219 504.7 236 512.3 252.8 517.7C269.7 523 286.3 526 303.2 523.5C320 521 337 513 353.8 512.5C370.7 512 387.3 519 404.2 521.8C421 524.7 438 523.3 454.8 523.7C471.7 524 488.3 526 505.2 523.5C522 521 539 514 555.8 511.8C572.7 509.7 589.3 512.3 606.2 510.2C623 508 640 501 656.8 501C673.7 501 690.3 508 707.2 508.7C724 509.3 741 503.7 757.8 499.7C774.7 495.7 791.3 493.3 808.2 495.8C825 498.3 842 505.7 858.8 511.5C875.7 517.3 892.3 521.7 909.2 523.5C926 525.3 943 524.7 951.5 524.3L960 524L960 541L951.5 541C943 541 926 541 909.2 541C892.3 541 875.7 541 858.8 541C842 541 825 541 808.2 541C791.3 541 774.7 541 757.8 541C741 541 724 541 707.2 541C690.3 541 673.7 541 656.8 541C640 541 623 541 606.2 541C589.3 541 572.7 541 555.8 541C539 541 522 541 505.2 541C488.3 541 471.7 541 454.8 541C438 541 421 541 404.2 541C387.3 541 370.7 541 353.8 541C337 541 320 541 303.2 541C286.3 541 269.7 541 252.8 541C236 541 219 541 202.2 541C185.3 541 168.7 541 151.8 541C135 541 118 541 101.2 541C84.3 541 67.7 541 50.8 541C34 541 17 541 8.5 541L0 541Z"
            fill={'var(--secondary)'}
            stroke-linecap="round"
            stroke-linejoin="miter"
          />
        </svg>
      </div>
    </>
  );
};

export default AboutPage;