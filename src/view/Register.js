class RegisterView extends View {
  constructor(parentNode) {
    super(parentNode);
  }

  template() {
    return `
    <main class="container-fluid d-flex  justify-content-center align-items-center vh-100 bg-dark ">
      <div class="container w-75 border border-3 border-light rounded p-4 bg-light">
        <form id="form-register">
          <h2 class="fs-1 mb-3 text-center">Cadastrar</h2>
          <div class="mb-3">
            <label for="username-register-input" class="form-label">Usuário</label>
            <input type="text" class="form-control" id="username-register-input" required />
          </div>
          <div class="mb-3">
            <label for="email-register-input" class="form-label">Email</label>
            <input type="email" class="form-control" id="email-register-input" required />
          </div>
          <div class="mb-3">
            <label for="password-login-input" class="form-label">Senha</label>
            <input type="password" class="form-control" id="password-register-input" required/>
          </div>
          <div class="mb-3">
            <label for="confirm-password-login-input" class="form-label">Confirmar Senha</label>
            <input type="password" class="form-control" id="confirm-password-register-input" required />
          </div>
          <div class="d-flex flex-row " >
            <button type="submit" id="register-submit" class="w-50 btn btn-primary m-1">Cadastrar</button>
            <button type="button" id="login-input" class="w-50 btn btn-secundary m-1">Entrar</button>
          </div>
        </form>
      <div>
    </main>

    `;
  }
}
