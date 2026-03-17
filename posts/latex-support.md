---
title: 在博客中使用 LaTeX 公式
date: 2026-03-17
category: 技术教程
tags: [LaTeX, 数学, KaTeX]
---

## LaTeX 公式支持

本博客通过 KaTeX 支持完整的 LaTeX 数学公式渲染，使用方法与标准 LaTeX 一致。

## 行内公式

使用单个美元符号 `$...$` 插入行内公式。

例如，爱因斯坦质能方程 $E = mc^2$，欧拉公式 $e^{i\pi} + 1 = 0$，或者二次方程求根公式 $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$。

## 块级公式

使用双美元符号 `$$...$$` 插入独立的块级公式：

**麦克斯韦方程组：**

$$\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$$

$$\nabla \cdot \mathbf{B} = 0$$

$$\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}$$

$$\nabla \times \mathbf{B} = \mu_0 \left( \mathbf{J} + \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t} \right)$$

**高斯积分：**

$$\int_{-\infty}^{+\infty} e^{-x^2} dx = \sqrt{\pi}$$

**矩阵：**

$$A = \begin{pmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{pmatrix}$$

**贝叶斯定理：**

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

**傅里叶变换：**

$$\hat{f}(\xi) = \int_{-\infty}^{+\infty} f(x) e^{-2\pi i x \xi} dx$$

## 混合使用

可以在正文中自由混合文字、代码和公式。

例如，对于函数 $f(x) = x^2$，其导数为 $f'(x) = 2x$，用代码表示：

```python
def f(x):
    return x ** 2

def f_prime(x):
    return 2 * x
```

其中导数的定义是：

$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

## 常用 LaTeX 符号

| 符号 | LaTeX 代码 | 效果 |
|------|-----------|------|
| 求和 | `\sum_{i=1}^{n}` | $\sum_{i=1}^{n}$ |
| 积分 | `\int_{a}^{b}` | $\int_{a}^{b}$ |
| 分数 | `\frac{a}{b}` | $\frac{a}{b}$ |
| 根号 | `\sqrt{x}` | $\sqrt{x}$ |
| 希腊字母 | `\alpha, \beta, \gamma` | $\alpha, \beta, \gamma$ |
| 偏导 | `\partial` | $\partial$ |
| 无穷 | `\infty` | $\infty$ |
| 箭头 | `\rightarrow` | $\rightarrow$ |

