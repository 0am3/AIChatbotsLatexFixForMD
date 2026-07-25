# Sample conversation 1

با استفاده از سری فوریه تابع \( f(x) = x^2 \) در بازه \( |x| < 1 \) (یعنی بازه \( (-1, 1) \) با دوره تناوب \( 2 \) )، مقادیر سری‌های خواسته شده را محاسبه می‌کنیم.

### ۱. محاسبه سری فوریه تابع
از آنجا که \( f(x) = x^2 \) تابعی زوج است، ضرایب سینوسی صفر هستند (\( b_n = 0 \)) و سری فوریه به‌صورت زیر نوشته می‌شود:
\[
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} a_n \cos(n\pi x)
\]
که در آن \( L = 1 \) و ضرایب از روابط زیر به‌دست می‌آیند:
\[
a_0 = 2 \int_{0}^{1} f(x) \, dx = 2 \int_{0}^{1} x^2 \, dx = 2 \left[ \frac{x^3}{3} \right]_0^1 = \frac{2}{3}
\]
\[
a_n = 2 \int_{0}^{1} f(x) \cos(n\pi x) \, dx = 2 \int_{0}^{1} x^2 \cos(n\pi x) \, dx
\]
برای محاسبه انتگرال، از روش جزء به جزء استفاده می‌کنیم:
\[
\int x^2 \cos(kx) \, dx = \frac{x^2}{k}\sin(kx) + \frac{2x}{k^2}\cos(kx) - \frac{2}{k^3}\sin(kx) \quad (k = n\pi)
\]
با قرار دادن حدود \( 0 \) تا \( 1 \) و توجه به اینکه \( \sin(n\pi) = 0 \) و \( \cos(n\pi) = (-1)^n \) :
\[
\int_{0}^{1} x^2 \cos(n\pi x) \, dx = \frac{2(-1)^n}{n^2\pi^2}
\]
بنابراین:
\[
a_n = 2 \cdot \frac{2(-1)^n}{n^2\pi^2} = \frac{4(-1)^n}{n^2\pi^2}
\]
حال سری فوریه کامل می‌شود:
\[
f(x) = \frac{1}{3} + \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{(-1)^n}{n^2} \cos(n\pi x)
\]

### ۲. محاسبه \( \displaystyle \sum_{n=1}^{\infty} \frac{1}{n^2} \)
با قرار دادن \( x = 1 \) در سری فوریه (که تابع در این نقطه پیوسته است و \( f(1) = 1 \) ):
\[
1 = \frac{1}{3} + \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{(-1)^n}{n^2} \cos(n\pi)
\]
از آنجا که \( \cos(n\pi) = (-1)^n \) :
\[
1 = \frac{1}{3} + \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{(-1)^{2n}}{n^2} = \frac{1}{3} + \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{1}{n^2}
\]
\[
1 - \frac{1}{3} = \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{1}{n^2} \quad \Rightarrow \quad \frac{2}{3} = \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{1}{n^2}
\]
\[
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
\]

### ۳. محاسبه \( \displaystyle \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^2} \)
با قرار دادن \( x = 0 \) در سری فوریه (\( f(0) = 0 \) و \( \cos(0) = 1 \) ):
\[
0 = \frac{1}{3} + \frac{4}{\pi^2} \sum_{n=1}^{\infty} \frac{(-1)^n}{n^2}
\]
\[
\sum_{n=1}^{\infty} \frac{(-1)^n}{n^2} = -\frac{\pi^2}{12}
\]
از آنجا که \( (-1)^{n+1} = -(-1)^n \) :
\[
\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^2} = \frac{\pi^2}{12}
\]

### پاسخ نهایی
\[
\boxed{\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}} \quad , \quad \boxed{\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^2} = \frac{\pi^2}{12}}
\]
