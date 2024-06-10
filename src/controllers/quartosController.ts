import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";
import { v4 as uuidv4 } from "uuid";
import { Quarto } from "../classes/quartos";

const localStorage = new LocalStorage("./scratch");
const STORAGE_KEY = "quartos";

const obterQuartosArmazenados = (): Quarto[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const armazenarQuarto = (quartos: Quarto[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quartos));
};

export const adicionarQuarto = (req: Request, res: Response): void => {
  const quartos = obterQuartosArmazenados();
  const novoQuarto: Quarto = new Quarto(
    uuidv4(),
    req.body.numero,
    req.body.tipo,
    req.body.preco
  );
  quartos.push(novoQuarto);
  armazenarQuarto(quartos);
  res.status(201).json(novoQuarto);
};

export const listarQuartos = (req: Request, res: Response): void => {
  const quartos = obterQuartosArmazenados();
  res.json(quartos);
};

export const modificarQuarto = (req: Request, res: Response): void => {
  const { id } = req.params;
  const quartoAtualizado: Quarto = new Quarto(
    id,
    req.body.numero,
    req.body.tipo,
    req.body.preco
  );
  const quartos = obterQuartosArmazenados();
  const index = quartos.findIndex((q) => q.id === id);
  if (index !== -1) {
    quartos[index] = quartoAtualizado;
    armazenarQuarto(quartos);
    res.json(quartoAtualizado);
  } else {
    res.status(404).json({ message: "Quarto não encontrado" });
  }
};

export const removerQuarto = (req: Request, res: Response): void => {
  const { id } = req.params;
  const quartos = obterQuartosArmazenados();
  const quartosFiltrados = quartos.filter((q) => q.id !== id);
  armazenarQuarto(quartosFiltrados);
  res.status(204).send();
};
