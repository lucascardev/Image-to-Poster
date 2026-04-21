import React from 'react';
import { CloseIcon } from './Icons';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed prose prose-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Política de Privacidade">
    <p>Bem-vindo ao <strong>Print My Poster</strong>. Sua privacidade é muito importante para nós.</p>
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Processamento Local</h3>
    <p>O funcionamento da nossa ferramenta baseia-se em tecnologias nativas de cliente (Client-Side). Isso significa que as imagens que você envia para o site não são salvas, repassadas ou hospedadas em nossos servidores. Todo o processo de conversão em PDF acontece diretamente no seu navegador, prezando de forma total pela confidencialidade dos seus arquivos.</p>
    
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Cookies e Google AdSense</h3>
    <p>Empregamos serviços de terceiros como o Google AdSense e o Google Analytics para manter o projeto gratuito e nos informar como os usuários chegam à nossa página.</p>
    <p>O Google e seus parceiros utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário a este e a outros sites na Internet. Os usuários podem desativar a publicidade personalizada acessando as <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Configurações de Anúncios do Google</a>.</p>
    
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Informações de Contato</h3>
    <p>Se você tem qualquer dúvida adicional a respeito da nossa Política de Privacidade, não hesite em entrar em contato.</p>
  </Modal>
);

export const TermsOfServiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Termos de Serviço">
    <p>Ao acessar e utilizar o <strong>Print My Poster</strong>, você concorda com estes termos de serviço.</p>
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Uso da Ferramenta</h3>
    <p>Nosso aplicativo é disponibilizado gratuitamente sob seu próprio risco. Não oferecemos garantias sobre a exatidão e qualidade da impressão final caso sua impressora ou materiais não possuam as devidas calibrações. Nos eximimos de custos oriundos de tintas utilizadas de forma equivocada.</p>
    
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Uso Ilegal</h3>
    <p>Ao enviar uma imagem ao nosso site, você garante os direitos e copyrights necessários sobre aquele arquivo. É estritamente proibida a utilização do Print My Poster para gerar material ilícito, difamatório ou não-licenciado que afete terceiros ou seja comercializado ilegalmente.</p>
    
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Disponibilidade do Serviço</h3>
    <p>Este sistema pode sair do ar ou ser permanentemente fechado a nosso exclusivo critério sem aviso prévio.</p>
  </Modal>
);

export const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Sobre e Contato">
    <p>O <strong>Print My Poster</strong> nasceu da vontade de democratizar artes de paredes complexas e gigantes em casa com zero taxas em gráficas usando metodologias "Rasterbator". Construimos um algoritmo client-side (no seu navegador) inovador e ágil permitindo criações imediatas respeitando os padrões de folhas A4.</p>
    
    <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Falar com o Criador</h3>
    <p>Caso tenha uma sugestão de melhoria técnica, ou algo reportado que necessita manutenção entre em contato pelo e-mail: <strong>lucasmatheussc97@gmail.com</strong>.</p>
  </Modal>
);
