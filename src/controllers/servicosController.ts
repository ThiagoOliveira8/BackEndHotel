import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";
import { v4 as uuidv4 } from "uuid";
import { Servicos } from "../classes/servicos";

const localStorage = new LocalStorage("./scratch");
const STORAGE_KEY = "servicos";

const obterServicosArmazenados = (): Servicos[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const armazenarServicos = (servicos: Servicos[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos));
};

export const adicionarServico = (req: Request, res: Response): void => {
  const servicos = obterServicosArmazenados();
  const novoServico: Servicos = new Servicos(
    uuidv4(),
    req.body.nome,
    req.body.descricao,
    req.body.preco
  );
  servicos.push(novoServico);
  armazenarServicos(servicos);
  res.status(201).json(novoServico);
};

export const listarServicos = (req: Request, res: Response): void => {
  const servicos = obterServicosArmazenados();
  res.json(servicos);
};

export const modificarServico = (req: Request, res: Response): void => {
  const { id } = req.params;
  const servicoAtualizado: Servicos = new Servicos(
    id,
    req.body.nome,
    req.body.descricao,
    req.body.preco
  );
  const servicos = obterServicosArmazenados();
  const index = servicos.findIndex((s) => s.id === id);
  if (index !== -1) {
    servicos[index] = servicoAtualizado;
    armazenarServicos(servicos);
    res.json(servicoAtualizado);
  } else {
    res.status(404).json({ message: "Serviço não encontrado" });
  }
};

export const removerServico = (req: Request, res: Response): void => {
  const { id } = req.params;
  const servicos = obterServicosArmazenados();
  const servicosFiltrados = servicos.filter((s) => s.id !== id);
  armazenarServicos(servicosFiltrados);
  res.status(204).send();
};
