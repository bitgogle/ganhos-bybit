// List of 45+ Brazilian Banks and PIX Apps
export const brazilianBanks = [
  // Major Banks
  "Banco do Brasil",
  "Bradesco",
  "Itaú Unibanco",
  "Caixa Econômica Federal",
  "Santander Brasil",
  "BTG Pactual",
  "Safra",
  "Banrisul",
  "Banco Votorantim",
  "Banco Pan",
  
  // Digital Banks
  "Nubank",
  "Inter",
  "C6 Bank",
  "PicPay",
  "Mercado Pago",
  "PagBank (PagSeguro)",
  "Neon",
  "Next",
  "Original",
  "Iti",
  
  // Investment Banks
  "XP Investimentos",
  "Rico",
  "Clear",
  "Ágora Investimentos",
  "Modal",
  "Guide Investimentos",
  "Órama",
  "Easynvest",
  "Genial Investimentos",
  "Warren",
  
  // Payment Apps
  "RecargaPay",
  "Ame Digital",
  "99Pay",
  "Pix no WhatsApp",
  "Samsung Pay",
  "Google Pay",
  "Apple Pay",
  "PayPal Brasil",
  "Méliuz",
  "Superdigital",
  
  // Regional Banks
  "Banco do Nordeste",
  "Banco da Amazônia",
  "Banestes",
  "Banpará",
  "BRB - Banco de Brasília",
  "Sicoob",
  "Sicredi",
  "Unicred",
  "Cresol",
  "Ailos",
  
  // Other Banks
  "BS2",
  "Agibank",
  "Banco BMG",
  "Banco Daycoval",
  "Banco Fibra",
  "Banco Industrial",
  "Banco Pine",
  "Banco Rendimento",
  "Banco Sofisa",
  "Banco Topázio",
];

// Brazilian first names
const brazilianFirstNames = [
  "João", "Maria", "José", "Ana", "Pedro", "Paula", "Carlos", "Fernanda",
  "Lucas", "Juliana", "Gabriel", "Camila", "Rafael", "Amanda", "Bruno",
  "Larissa", "Felipe", "Beatriz", "Thiago", "Letícia", "Matheus", "Gabriela",
  "Gustavo", "Rafaela", "Leonardo", "Carolina", "André", "Patrícia", "Ricardo",
  "Mariana", "Daniel", "Jéssica", "Eduardo", "Aline", "Marcelo", "Vanessa",
  "Rodrigo", "Adriana", "Fernando", "Renata", "Fábio", "Priscila", "Marcos",
  "Natália", "Paulo", "Tatiana", "Vinícius", "Daniela", "Diego", "Luciana"
];

// Brazilian last names
const brazilianLastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
  "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho",
  "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha",
  "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado",
  "Mendes", "Freitas", "Cardoso", "Ramos", "Gonçalves", "Santana", "Teixeira",
  "Araújo", "Correia", "Pinto", "Campos", "Castro", "Azevedo", "Melo",
  "Monteiro", "Barros", "Cunha", "Moura", "Reis", "Miranda", "Batista", "Duarte"
];

// Generate random CPF (formatted)
function generateRandomCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 10);
  
  const n1 = randomDigits();
  const n2 = randomDigits();
  const n3 = randomDigits();
  const n4 = randomDigits();
  const n5 = randomDigits();
  const n6 = randomDigits();
  const n7 = randomDigits();
  const n8 = randomDigits();
  const n9 = randomDigits();
  
  // Calculate first verification digit
  let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  
  // Calculate second verification digit
  let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
}

// Generate random phone number (Brazilian format)
function generateRandomPhone(): string {
  const ddd = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '92'][Math.floor(Math.random() * 10)];
  const firstDigit = '9';
  const rest = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  return `(${ddd}) ${firstDigit}${rest.slice(0, 4)}-${rest.slice(4)}`;
}

// Generate random email
function generateRandomEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br', 'bol.com.br'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
}

// Generate random PIX key (can be CPF, phone, email, or random key)
function generateRandomPixKey(cpf: string, phone: string, email: string): string {
  const type = Math.floor(Math.random() * 4);
  switch (type) {
    case 0:
      return cpf.replace(/[.\-]/g, ''); // CPF without formatting
    case 1:
      return phone.replace(/[() \-]/g, ''); // Phone without formatting
    case 2:
      return email;
    default:
      // Random EVP key format
      const chars = 'abcdef0123456789';
      let key = '';
      for (let i = 0; i < 32; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
      }
      return `${key.slice(0, 8)}-${key.slice(8, 12)}-${key.slice(12, 16)}-${key.slice(16, 20)}-${key.slice(20)}`;
  }
}

// Generate complete random Brazilian PIX sender details
export function generateRandomPixSender(): {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  bank: string;
  pixKey: string;
} {
  const firstName = brazilianFirstNames[Math.floor(Math.random() * brazilianFirstNames.length)];
  const lastName = brazilianLastNames[Math.floor(Math.random() * brazilianLastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  const cpf = generateRandomCPF();
  const phone = generateRandomPhone();
  const email = generateRandomEmail(firstName, lastName);
  const bank = brazilianBanks[Math.floor(Math.random() * brazilianBanks.length)];
  const pixKey = generateRandomPixKey(cpf, phone, email);
  
  return {
    name: fullName,
    cpf,
    phone,
    email,
    bank,
    pixKey
  };
}

// Format PIX key for display
export function formatPixKey(key: string): string {
  // If it looks like a CPF (11 digits)
  if (/^\d{11}$/.test(key)) {
    return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  // If it looks like a phone (10-11 digits starting with DDD)
  if (/^\d{10,11}$/.test(key)) {
    if (key.length === 11) {
      return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return key.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  // Otherwise return as-is
  return key;
}
