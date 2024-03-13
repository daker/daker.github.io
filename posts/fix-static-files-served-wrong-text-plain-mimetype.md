How to Fix Static Files Being Served with the Wrong text/plain Mimetype

I was performing some Python migrations of a Django web app that used to work, and since I switched to Windows 11 on my work machine, the static files were not being served with the correct mimetype `application/javascript` but rather `text/plain`.

After some digging into the web app code, I found that the assets were being served using the `serve` function from `django.views.static`. Upon checking the Django code, it turns out it does use the `mimetypes` module to guess the mimetype of the file.

```sh
C:\>python
Python 3.12.2 (tags/v3.12.2:6abddd9, Feb  6 2024, 21:26:36) [MSC v.1937 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import mimetypes
>>> content_type, encoding = mimetypes.guess_type("C:\script.js")
>>> print(content_type)
text/plain
```

On Gnu/Linux machines, mimetypes uses a list of `mime.types` files

```sh
>>> mimetypes.knownfiles
['/etc/mime.types', '/etc/httpd/mime.types', '/etc/httpd/conf/mime.types', '/etc/apache/mime.types', '/etc/apache2/mime.types', '/usr/local/etc/httpd/conf/mime.types', '/usr/local/lib/netscape/mime.types', '/usr/local/etc/httpd/conf/mime.types', '/usr/local/etc/mime.types']
>>> exit()
```

However, on Windows (as of Python 3.2), it uses the Windows registry settings.

```sh
C:\>reg query HKCR\.js /v "Content Type"

HKEY_CLASSES_ROOT\.js
    Content Type    REG_SZ    text/plain
```

So, we need to update the key with the correct mimetype.

```sh
C:\>reg add HKCR\.js /v "Content Type" /t REG_SZ /d application/javascript
```

Let's check now.

```sh
C:\>python
Python 3.12.2 (tags/v3.12.2:6abddd9, Feb  6 2024, 21:26:36) [MSC v.1937 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import mimetypes
>>> content_type, encoding = mimetypes.guess_type("C:\script.js")
>>> print(content_type)
application/javascript
```

I hope this helps if you encounter this issue :)
