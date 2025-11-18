export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm py-3 text-center text-body-sm text-gray border-t border-light-gray">
      <p>
        © Created with ❤️ by{' '}
        <a
          href="https://smartcamp.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-jungle hover:text-brand-mint no-underline hover:underline"
        >
          SmartCamp.AI
        </a>
      </p>
    </footer>
  );
}
