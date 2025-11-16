import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white/90 backdrop-blur-xl border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary text-white font-semibold text-base sm:text-lg">
                EW
              </div>
              <span className="text-lg sm:text-xl font-semibold text-darkTeal">EverWell</span>
            </div>
            <p className="text-mediumTeal text-xs sm:text-sm mb-4 max-w-md leading-relaxed">
              Combinando ciência e inovação para seu bem-estar e alta performance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-darkTeal mb-3 sm:mb-4 text-sm sm:text-base">Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/" className="text-xs sm:text-sm text-mediumTeal hover:text-primary transition-colors block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-xs sm:text-sm text-mediumTeal hover:text-primary transition-colors block py-1">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/duvidas" className="text-xs sm:text-sm text-mediumTeal hover:text-primary transition-colors block py-1">
                  Dúvidas
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-xs sm:text-sm text-mediumTeal hover:text-primary transition-colors block py-1">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-darkTeal mb-3 sm:mb-4 text-sm sm:text-base">Contato</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-mediumTeal">
              <li>
                <a
                  href="https://wa.me/5521998170460?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20EverWell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Política de Troca
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-primary/10">
          <p className="text-[10px] sm:text-xs text-mediumTeal mb-2 leading-relaxed">
            <strong>Termos e Condições:</strong> A EverWell não se destina a diagnosticar, tratar, curar ou prevenir qualquer doença. 
            Conectamos médicos e pacientes. Os medicamentos apresentados estão em estudo e já possuem milhares de pesquisas e casos 
            comprovados mundialmente. Conforme as Resoluções da Diretoria Colegiada (RDC) 327/2019 e 660/2022 da Anvisa, 
            todos os produtos são restritos e não podem haver propagandas.
          </p>
          <p className="text-[10px] sm:text-xs text-mediumTeal">
            Copyright 2025 EverWell. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

