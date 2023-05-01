class FastCommand:
    def __init__(self, short_cut, command):
        self.short_cut = short_cut
        self.command = command
        # Когда появится класс пользователя, будем привязывать id
        # к числу созданных быстрых команд
        self.id = 0
