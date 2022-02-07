import { getManager } from "typeorm";
import { Usuario } from "../entity/Usuario";

export class UsuarioController {

    async salvar(usuario: Usuario) {
        const usuarioSalvo = await getManager().save(usuario);
        return usuarioSalvo;
    }

    async deletar(id: number) {
        const usuario = await getManager().findOne(Usuario, id);
        const usuarioDeletado = await getManager().remove(usuario);
        return usuarioDeletado;
    }

    async atualizar(id: number, usuario: Usuario) {
        const usuarioAtualizado = await getManager().update(Usuario, id, usuario);
        return usuarioAtualizado;
    }

    async recuperarTodos() {
        const usuarios = await getManager().find(Usuario);
        return usuarios;
    }

    async recuperarPorId(id: number) {
        const usuario = await getManager().findOne(Usuario, id);
        return usuario;
    }

    

}