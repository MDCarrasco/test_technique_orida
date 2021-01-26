from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404,render,redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from .models import TodoList

# Create your views here.
class IndexView(LoginRequiredMixin, generic.edit.CreateView):
    template_name = 'todomaker/index.html'
    context_object_name = 'latest_todolist_list'
    fields = ['content']

    def post(self, request):
        self.save_or_delete()
        self.object_list = self.get_queryset()
        return HttpResponseRedirect(reverse('todomaker:index'))

    def get_queryset(self):
        return TodoList.objects.order_by('-created')[:5]

    def get_form(self):
        form = super().get_form()
        form.fields['content'] = self.request.POST.get('description', False)
        return form


    def save_or_delete(self):
        todos = TodoList.objects.all()
        form = self.get_form()
        # todos = get_list_or_404(TodoList)

        if self.request.method == "POST":
            if "taskAdd" in self.request.POST:
                todo = TodoList(content=form.fields['content'])
                todo.save()
                return redirect("/")
            if "taskDelete" in self.request.POST:
                checkedlist = self.request.POST["checkedbox"]
                for todo_id in checkedlist:
                    # todo = TodoList.objects.get(id=int(todo_id))
                    todo = get_object_or_404(TodoList, id=int(todo_id))
                    todo.delete()
        return render(self.request, "todomaker/index.html", {"todos": todos,})
