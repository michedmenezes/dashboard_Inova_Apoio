export type InitialGroup = {
  className: string;
  stageName: string;
  groupNumber: number;
  projectTitle: string;
  members: string[];
};

/**
 * Transcrição das tabelas de grupos do PDF de referência.
 * A seção "Projeto Comunidade GRIS" (1ª série A e 1ª série B) foi deliberadamente excluída.
 */
export const initialGroups: InitialGroup[] = [
  { className: "6º A", stageName: "Feira de Tecnologia", groupNumber: 1, projectTitle: "Projeto livre", members: ["Romeu", "M. Luiza", "Letícia", "Tiago"] },
  { className: "6º A", stageName: "Feira de Tecnologia", groupNumber: 2, projectTitle: "Modelagem 3D", members: ["Davi", "Manuela", "Cecília", "Eduardo"] },
  { className: "6º A", stageName: "Feira de Tecnologia", groupNumber: 3, projectTitle: "Projeto livre — o cérebro humano (IA)", members: ["Pedro", "Hugo", "Leonardo", "Arthur"] },
  { className: "6º A", stageName: "Feira de Tecnologia", groupNumber: 4, projectTitle: "Impressão 3D", members: ["Filipa", "Vinícius", "Clara", "Francisco", "Lucas"] },
  { className: "6º A", stageName: "Feira de Tecnologia", groupNumber: 5, projectTitle: "Corte a Laser", members: ["Antônia", "Mateus", "Enrico", "Eduardo F.", "Marina"] },
  { className: "6º B", stageName: "Feira de Tecnologia", groupNumber: 1, projectTitle: "ODS 13 — Combate às mudanças climáticas e ao aquecimento global", members: ["Beatriz", "Joaquim M.", "Lucas Castor", "Maria Luisa", "Maria Cecília"] },
  { className: "6º B", stageName: "Feira de Tecnologia", groupNumber: 2, projectTitle: "App para doações", members: ["Elise", "Bia Monteiro", "Joaquim P.", "Liz"] },
  { className: "6º B", stageName: "Feira de Tecnologia", groupNumber: 3, projectTitle: "Limpar a água: robô para retirar lixo", members: ["Mariana", "Laís", "Maria Valentina", "Felipe"] },
  { className: "6º B", stageName: "Feira de Tecnologia", groupNumber: 4, projectTitle: "Site de Responsabilidade de Preservação", members: ["Lara", "Valentina", "Eduardo", "Theo"] },
  { className: "6º B", stageName: "Feira de Tecnologia", groupNumber: 5, projectTitle: "Horta comunitária", members: ["Lucas", "Marina", "Gabriela", "Lorena"] },
  { className: "6º C", stageName: "Feira de Tecnologia", groupNumber: 1, projectTitle: "Marcenaria", members: ["Sofia", "Gabriel", "Antônio", "Heloísa"] },
  { className: "6º C", stageName: "Feira de Tecnologia", groupNumber: 2, projectTitle: "Prototipagem Manual", members: ["Manu", "Júlia", "Caetano", "Davi"] },
  { className: "6º C", stageName: "Feira de Tecnologia", groupNumber: 3, projectTitle: "Jogo Digital ODS", members: ["João Pedro", "Olga", "Luiza T.", "Luiz"] },
  { className: "6º C", stageName: "Feira de Tecnologia", groupNumber: 4, projectTitle: "Jogo Quiz", members: ["Luiza A.", "Lucca", "João Gabriel", "Pedro B."] },
  { className: "6º C", stageName: "Feira de Tecnologia", groupNumber: 5, projectTitle: "Projeto com Makey Makey", members: ["Francisco C.", "Tiago", "Francisco M.", "Miguel", "Lucas M."] },
  { className: "7º A", stageName: "II Etapa", groupNumber: 1, projectTitle: "Monitor de Temperatura e Umidade", members: ["Lara", "Marina P.", "Marina D.", "Francisco F."] },
  { className: "7º A", stageName: "II Etapa", groupNumber: 2, projectTitle: "Maquete Cidade Inteligente com Arduino", members: ["Letícia", "Maria Luisa", "Vinícius", "Rafaella", "Daniel"] },
  { className: "7º A", stageName: "II Etapa", groupNumber: 3, projectTitle: "Prototipagem Eletrônica com Lego", members: ["Nina", "Bento", "Giovanna", "Francisco B.", "Bianca"] },
  { className: "7º A", stageName: "II Etapa", groupNumber: 4, projectTitle: "Prototipagem eletrônica com Arduino e Sucata", members: ["Paulo", "Melina", "Clara R."] },
  { className: "7º A", stageName: "II Etapa", groupNumber: 5, projectTitle: "Projeto Livre de prototipagem com Arduino", members: ["Clarice", "Davi", "Maria Flor", "Beatriz C."] },
  { className: "7º A", stageName: "II Etapa", groupNumber: 6, projectTitle: "Tema Livre — Tecnologia e Sociedade", members: ["Rabello", "Mariana", "Beatriz Y.", "Carlos"] },
  { className: "7º B", stageName: "II Etapa", groupNumber: 1, projectTitle: "Monitor de qualidade do ar", members: ["Tomás", "Lucas", "Maria Sampaio", "Beatriz", "Gabriel"] },
  { className: "7º B", stageName: "II Etapa", groupNumber: 2, projectTitle: "Piano com Arduino", members: ["Tomás Vale", "Eduardo", "Joaquim", "Bianca", "Maria Sales"] },
  { className: "7º B", stageName: "II Etapa", groupNumber: 3, projectTitle: "Garra Robótica", members: ["Bernardo Leitão", "Maria Luiza", "Bernardo V.", "Bruno"] },
  { className: "7º B", stageName: "II Etapa", groupNumber: 4, projectTitle: "Projeto Livre de prototipagem com Arduino", members: ["Jorge", "Giovanna", "Alice", "Henrique", "Malu"] },
  { className: "7º B", stageName: "II Etapa", groupNumber: 5, projectTitle: "Robô Sumô com Arduino", members: ["Laís", "João Mateus", "Bernardo M.", "Pedro Xavier", "Sara"] },
  { className: "7º B", stageName: "II Etapa", groupNumber: 6, projectTitle: "Tecnologias Vestíveis (Wearables) com Arduino", members: ["Pedro Simões", "Matheus", "Fernando", "Luiza", "Cecília"] },
  { className: "7º C", stageName: "II Etapa", groupNumber: 1, projectTitle: "Arduino e suas aplicações na prototipagem", members: ["Anita", "Pedro", "Fred", "Alice"] },
  { className: "7º C", stageName: "II Etapa", groupNumber: 2, projectTitle: "Microbit", members: ["Laura", "Fernando Guerra", "F. Salazar", "Chloê", "Bernardo"] },
  { className: "7º C", stageName: "II Etapa", groupNumber: 3, projectTitle: "Internet das Coisas (IoT)", members: ["Júlia", "Edu Becks", "Vinicius", "Bia"] },
  { className: "7º C", stageName: "II Etapa", groupNumber: 4, projectTitle: "Espaços Makers e Fab Labs", members: ["Lara", "Marina", "Paulo", "Heitor O."] },
  { className: "7º C", stageName: "II Etapa", groupNumber: 5, projectTitle: "Smart Cities (Cidades Inteligentes)", members: ["Luiza", "Elis", "Samuel V.", "Heitor V."] },
  { className: "7º C", stageName: "II Etapa", groupNumber: 6, projectTitle: "Tema Livre — Tecnologia e Sociedade", members: ["Liz", "Távora", "Ana Alice", "Cordeiro", "João"] },
  { className: "8º A", stageName: "Projeto Autoral", groupNumber: 1, projectTitle: "O impacto das telas em crianças e adolescentes", members: ["Laís", "Maria Eduarda", "Benício", "Lucas", "Maria Clara"] },
  { className: "8º A", stageName: "Projeto Autoral", groupNumber: 2, projectTitle: "O impacto dos esportes na saúde física dos estudantes", members: ["Thais", "Luiza", "Caio", "Pedro S.", "Maria Fernanda"] },
  { className: "8º A", stageName: "Projeto Autoral", groupNumber: 3, projectTitle: "Saúde Financeira de Jovens", members: ["Isabela", "Manuela", "José", "Gustavo", "Marina", "Heitor"] },
  { className: "8º A", stageName: "Projeto Autoral", groupNumber: 4, projectTitle: "O impacto dos vídeos curtos para a mente", members: ["Igor", "Ian", "Antonio", "Theo", "Pedro V."] },
  { className: "8º B", stageName: "Projeto Autoral", groupNumber: 1, projectTitle: "Saúde Mental e uso das Redes Sociais", members: ["Cecília", "Maitê Burity", "Marina", "Lucas", "Luiz", "Eduardo"] },
  { className: "8º B", stageName: "Projeto Autoral", groupNumber: 2, projectTitle: "Como melhorar a rotina de sono dos estudantes do colégio", members: ["Joaquim", "Davi G.", "Anita", "Beatriz"] },
  { className: "8º B", stageName: "Projeto Autoral", groupNumber: 3, projectTitle: "Segurança e exposição nas redes sociais", members: ["Amanda", "Tarsila", "Edgar", "Davi A."] },
  { className: "8º B", stageName: "Projeto Autoral", groupNumber: 4, projectTitle: "A segurança das mulheres no Brasil", members: ["Júlia", "Ana Luiza", "Leonardo", "Pedro Lapenda", "Igor"] },
  { className: "8º B", stageName: "Projeto Autoral", groupNumber: 5, projectTitle: "Poluição no Rio Capibaribe", members: ["Antonio", "Pedro Lewis", "Eduardo M.", "Bernardo"] },
  { className: "8º B", stageName: "Projeto Autoral", groupNumber: 6, projectTitle: "Acesso a informações e estudos dos alunos do Colégio Apoio", members: ["Eduardo T.", "Viggo", "Leon", "Marconi", "Maitê"] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 1, projectTitle: "Como as redes sociais afetam a saúde mental dos adolescentes", members: ["Celina", "Daniel", "Sofia", "Pedro C."] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 2, projectTitle: "Dificuldade dos idosos no uso da tecnologia", members: ["Julia", "Moema", "Luana"] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 3, projectTitle: "Uso excessivo de telas entre os jovens", members: ["Luisa", "Pedro H.", "Maria Clara", "Enzo"] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 4, projectTitle: "Como a tecnologia influencia no machismo", members: ["Antônia", "Tobias", "Beatriz", "Otto"] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 5, projectTitle: "O impacto das redes sociais na saúde mental dos adolescentes", members: ["Rebeca", "Lucas S.", "Lara", "Bento"] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 6, projectTitle: "Projeto autoral sem título registrado", members: ["Leticia Souza", "Enzo Oliveira", "Maira"] },
  { className: "8º C", stageName: "Projeto Autoral", groupNumber: 7, projectTitle: "Cadeira de Rodas Adaptada de baixo custo", members: ["Luísa Augusta", "Clara", "Henrique", "Tomé"] },
];
