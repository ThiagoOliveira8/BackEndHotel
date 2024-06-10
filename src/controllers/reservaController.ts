import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";
import { v4 as uuidv4 } from "uuid";
import { Reserva } from "../classes/reserva";
import { Cliente } from "../classes/clientes";
import { Quarto } from "../classes/quartos";

const localStorage = new LocalStorage("./scratch");
const STORAGE_KEY = "reservasHotel";
const CLIENTE_KEY = "clientes";
const QUARTO_KEY = "quartos";

const obterReservasSalvas = (): Reserva[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const armazenarReserva = (reservas: Reserva[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
};

const obterClientesSalvos = (): Cliente[] => {
  const data = localStorage.getItem(CLIENTE_KEY);
  return data ? JSON.parse(data) : [];
};

const obterQuartosSalvos = (): Quarto[] => {
  const data = localStorage.getItem(QUARTO_KEY);
  return data ? JSON.parse(data) : [];
};

export const criarReserva = (req: Request, res: Response) => {
  const { clienteId, quartoId, dataEntrada, dataSaida } = req.body;

  const clientes = obterClientesSalvos();
  const quartos = obterQuartosSalvos();

  const clienteEncontrado = clientes.find((c) => c.id === clienteId);
  const quartoEncontrado = quartos.find((q) => q.id === quartoId);

  if (!clienteEncontrado || !quartoEncontrado) {
    return res
      .status(404)
      .json({ message: "Cliente ou quarto não encontrado" });
  }

  const reservas = obterReservasSalvas();
  const novaReserva = new Reserva(
    uuidv4(),
    clienteId,
    quartoId,
    dataEntrada,
    dataSaida
  );
  reservas.push(novaReserva);
  armazenarReserva(reservas);
  res.status(201).json(novaReserva);
};

export const listarReservas = (req: Request, res: Response): void => {
  const reservas = obterReservasSalvas();
  res.json(reservas);
};

export const editarReserva = (req: Request, res: Response) => {
  const { id } = req.params;
  const { clienteId, quartoId, dataEntrada, dataSaida } = req.body;

  const clientes = obterClientesSalvos();
  const quartos = obterQuartosSalvos();

  const clienteEncontrado = clientes.find((c) => c.id === clienteId);
  const quartoEncontrado = quartos.find((q) => q.id === quartoId);

  if (!clienteEncontrado || !quartoEncontrado) {
    return res
      .status(404)
      .json({ message: "Cliente ou quarto não encontrado" });
  }

  const reservas = obterReservasSalvas();
  const index = reservas.findIndex((r) => r.id === id);

  if (index !== -1) {
    const reservaAtualizada = new Reserva(
      id,
      clienteId,
      quartoId,
      dataEntrada,
      dataSaida
    );
    reservas[index] = reservaAtualizada;
    armazenarReserva(reservas);
    res.json(reservaAtualizada);
  } else {
    res.status(404).json({ message: "Reserva não encontrada" });
  }
};

export const deletarReserva = (req: Request, res: Response): void => {
  const { id } = req.params;
  const reservas = obterReservasSalvas();
  const reservasFiltradas = reservas.filter((r) => r.id !== id);
  armazenarReserva(reservasFiltradas);
  res.status(204).send();
};
