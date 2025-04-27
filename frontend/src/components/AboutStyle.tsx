export const AboutStyle = () => {
    return (
        <section className=" text-gray-300 text-center py-8 px-4 bg-[#172130]/80 backdrop-blur-lg shadow-md border-t-2 border-white/20 select-none">
            <div className="max-w-md mx-auto space-y-4">
                {/* Title with Logo */}
                <h2 className="text-2xl font-semibold text-white flex items-center justify-center gap-1">
                    Discover <span className="text-indigo-400 ml-1">BlogBox</span>
                    <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain" />
                </h2>

                {/* Shortened Description */}
                <p className="text-sm text-gray-400">
                    A space for writers & readers. Share stories, engage, and be part of a meaningful community.
                </p>

                {/* GitHub Link */}
                <a
                    href="https://github.com/het4399/Medium"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-indigo-400 text-sm font-medium hover:opacity-80 transition"
                >
                    View on GitHub →
                </a>
            </div>
        </section>
    );
};
