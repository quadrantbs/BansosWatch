function Footer() {
    return (
      <footer className="bg-neutral py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-neutral-content">
            &copy; {new Date().getFullYear()} Bansos Watch. All rights reserved.
          </p>
          <div className="flex justify-center mt-2 space-x-4">
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  