class RegisterController extends Controller {
  constructor(router) {
    super(router);
    this._view = new RegisterView("#root");
    this._user = new UserModel();
    this._user.initialize();
  }

  process() {
    try {
      this._view.render();
      this._setEvents();
    } catch (error) {
      console.error("Falha no processo de login:", error);
    }
  }

  _setEvents() {
    this._setRegisterSubmit();
    this._setLoginInput();
  }

  _setRegisterSubmit() {
    $("#form-register").on("submit", async (e) => {
      e.preventDefault();
      const username = $("#username-register-input").val();
      const password = $("#password-register-input").val();
      const confirmPassword = $("#confirm-password-register-input").val();
      const email = $("#email-register-input").val();

      if (!username || !password || !confirmPassword || !email) {
        alert("Todos os campos são obrigatórios.");
        return;
      }

      if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      if (!this._validateEmail(email)) {
        alert("O email não é válido.");
        return;
      }
      const repetid = await this._user.findByEmail(email);
      if (repetid) {
        alert("Já existe um usuário com este Email.");
        return;
      }
    });
  }

  _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  _setLoginInput() {
    $("#login-input").on("click", (e) => {
      this._router.navigate("/login");
    });
  }
}
