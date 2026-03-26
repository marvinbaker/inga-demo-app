export default function Footer() {
  return (
    <footer className="bg-navy-800 text-gray-400 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-t border-white/10 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold text-sm mb-2">
                Clinical<span className="text-accent-500">Editorial</span>
              </h3>
              <p className="text-xs leading-relaxed">
                Helping ER+/HER2- breast cancer patients discover relevant
                clinical trials worldwide. Data sourced from ClinicalTrials.gov
                and PubMed.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-2">
                Medical Disclaimer
              </h3>
              <p className="text-xs leading-relaxed">
                This tool is for informational purposes only and does not
                constitute medical advice. Always consult your healthcare
                provider before making decisions about clinical trial
                participation.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 text-center">
            Data from{" "}
            <a
              href="https://clinicaltrials.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-500"
            >
              ClinicalTrials.gov
            </a>{" "}
            &{" "}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-500"
            >
              PubMed
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
