import os

from fabric import task, Connection

@task
def deploy(ctx, name):
    data = ctx[name]

    folder = data.pop("folder")
    c = Connection(**data.get('connection', {}))

    with c.prefix("source ~/.zshrc"):
        with c.cd(os.path.dirname(os.path.dirname(folder))):
            c.run("git pull")
        with c.cd(folder):
            c.run("bundle exec jekyll build")

