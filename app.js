class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	resetarInputs() {
		ano.value = "";
		mes.value = "";
		dia.value = "";
		tipo.value = "";
		descricao.value = "";
		valor.value = "";
	}

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == "" || this[i] == null) {
				return false;
			}
		}
		this.resetarInputs();
		return true;
	}
}

class BD {
	constructor() {
		let id = localStorage.getItem("id");

		if (id === null) {
			localStorage.setItem("id", 0);
		}
	}
	getProximoId() {
		let getProximoId = localStorage.getItem("id");
		return parseInt(getProximoId) + 1;
	}

	gravar(d) {
		let id = this.getProximoId();
		localStorage.setItem(id, JSON.stringify(d));

		localStorage.setItem("id", id);
	}

	recuperarTodosRegistros() {
		//array de despesas (cada indice um obj)

		let despesas = Array();

		let id = localStorage.getItem("id");

		//recuperar todas as despesas cadastradas em local Storage
		for (let i = 1; i <= id; i++) {
			//recuperar a despesa

			let despesa = JSON.parse(localStorage.getItem(i));
			//existe a possibiliade de haver indices que foram pulados ou removidos
			//neste caso vamos literalmente pular esses indices

			if (despesa === null) {
				continue;
			}
			despesa.id = i;
			despesas.push(despesa);
		}

		return despesas;
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array();
		despesasFiltradas = this.recuperarTodosRegistros();

		//aplicando filtros de ano, mes, dia, tipo, descricao, valor
		if (despesa.ano != "") {
			despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
		}
		if (despesa.mes != "") {
			despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
		}
		if (despesa.dia != "") {
			despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
		}
		if (despesa.tipo != "") {
			despesasFiltradas = despesasFiltradas.filter(
				(d) => d.tipo == despesa.tipo
			);
		}
		if (despesa.descricao != "") {
			despesasFiltradas = despesasFiltradas.filter(
				(d) => d.descricao == despesa.descricao
			);
		}
		if (despesa.valor != "") {
			despesasFiltradas = despesasFiltradas.filter(
				(d) => d.valor == despesa.valor
			);
		}

		return despesasFiltradas;
	}

	remover(id) {
		localStorage.removeItem(id);
	}
}

let bd = new BD();

function cadastrarDespesa() {
	var modalHeader = document.querySelector(".modal-header");
	var modalBody = document.querySelector(".modal-body");
	var modalButton = document.querySelector("#modalbutton");
	var modalTitle = document.querySelector(".modal-title");
	var ano = document.getElementById("ano");
	var mes = document.getElementById("mes");
	var dia = document.getElementById("dia");
	var tipo = document.getElementById("tipo");
	var descricao = document.getElementById("descricao");
	var valor = document.getElementById("valor");
	function modalError() {
		if (modalHeader.classList.contains("text-success")) {
			modalHeader.classList.remove("text-success");
		}
		if (modalButton.classList.contains("btn-success")) {
			modalButton.classList.remove("btn-success");
		}
		modalHeader.classList.add("text-danger");
		modalTitle.innerHTML = "Faltam Informacoes";
		modalBody.innerHTML = "Volte e preencha os campos restantes";
		modalButton.classList.add("btn-danger");
		modalButton.innerHTML = "Voltar e corrigir";
	}
	function modalSuccess() {
		if (modalHeader.classList.contains("text-danger")) {
			modalHeader.classList.remove("text-danger");
		}
		if (modalButton.classList.contains("btn-danger")) {
			modalButton.classList.remove("btn-danger");
		}
		modalHeader.classList.add("text-success");
		modalTitle.innerHTML = "Registro completo";
		modalBody.innerHTML = "Sua despesa foi registrada com sucesso";
		modalButton.classList.add("btn-success");
		modalButton.innerHTML = "Voltar";
	}

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	);

	if (despesa.validarDados()) {
		bd.gravar(despesa);

		console.log("valido");

		modalSuccess();
		$("#ModalDespesa").modal("show");
	} else {
		console.log("invalido");

		modalError();
		$("#ModalDespesa").modal("show");
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros();
	}
	//selecionando o tbody
	let listaDespesas = document.getElementById("listaDespesas");
	listaDespesas.innerHTML = "";

	//percorrer o array despesas, listando cada despesa

	despesas.forEach(function (d) {
		//criando a linha (tr)
		let linha = listaDespesas.insertRow();

		//criando coluna (td)

		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

		//ajustar

		switch (d.tipo) {
			case "1":
				d.tipo = "Alimentacao";
				break;
			case "2":
				d.tipo = "Educacao";
				break;
			case "3":
				d.tipo = "Lazer";
				break;
			case "4":
				d.tipo = "Saude";
				break;
			case "5":
				d.tipo = "Transporte";
				break;
		}
		linha.insertCell(1).innerHTML = d.tipo;
		linha.insertCell(2).innerHTML = d.descricao;
		linha.insertCell(3).innerHTML = d.valor;

		//criar botao excluir

		let btn = document.createElement("button");
		btn.className = "btn btn-danger";
		btn.innerHTML = '<i class="fas fa-times"></i>';
		btn.id = d.id;
		btn.onclick = function () {
			let id = this.id.replace("id_despesa", "");

			bd.remover(id);

			window.location.reload();
		};
		linha.insertCell(4).append(btn);
	});
}

function pesquisarDespesa() {
	let ano = document.getElementById("ano").value;
	let mes = document.getElementById("mes").value;
	let dia = document.getElementById("dia").value;
	let tipo = document.getElementById("tipo").value;
	let descricao = document.getElementById("descricao").value;
	let valor = document.getElementById("valor").value;

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

	let despesas = bd.pesquisar(despesa);

	let listaDespesas = document.getElementById("listaDespesas");

	//percorrer o array despesas, listando cada despesa
	listaDespesas.innerHTML = "";
	carregaListaDespesas(despesas, true);
}
