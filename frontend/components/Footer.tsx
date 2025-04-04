import HowItWorksModal from "./how-it-works-modal";

function Footer() {
  return (
    <footer className='border-t py-6 md:py-0'>
      <div className='container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row'>
        <p className='text-sm text-muted-foreground'>
          &copy; {new Date().getFullYear()} APTOPIA. All rights reserved.
        </p>
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          <HowItWorksModal
            trigger={<button className='hover:underline'>How it works?</button>}
          />

          {/* <a href="#" className="hover:underline">
                Terms
                </a>
                <a href="#" className="hover:underline">
                Privacy
                </a>
                <a href="#" className="hover:underline">
                Contact
                </a> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
