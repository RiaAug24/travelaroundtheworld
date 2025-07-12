import style from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={style.footer}>
        <img src="../public/icon.png" alt="logo-WorldWise" width={25} height={25}/>
        <span>
          WorldWise &copy; 2024
        </span>
      </footer>
  )
}
