// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      5.72
// @author       https://github.com/mattiadr
// @description  Adds various anime and manga links to MAL
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQRDic4ysC1kQAAA+lJREFUWMPtlk1sVFUUx3/n3vvmvU6nnXbESkTCR9DYCCQSFqQiMdEY4zeJuiBhwUISAyaIHzHGaDTxKyzEr6ULNboiRonRhQrRCMhGiDFGA+WjhQ4NVKbtzJuP9969Lt4wlGnBxk03vZv3cu495/7u/5x7cmX1xk8dczjUXG4+DzAPMA8AYNoNIunXudnZ2+enrvkvn2kADkhiiwM8o6YEEuLE4pxDK0GakZUIoiCOHXFiW2uNEqyjZdNaIbMB0Ero7gwQ4OJEDa0VSoR6lNDT5eMZRaUa0YgSjFZU6zG1ekK+y6er00eJECWWchiRMYp8VwBAOYyw1l0dQIlQrcfcvKSHT968j+5chg+/OMoHnx9FCdwzsIRdz24gGxhe2v0Le74/htaKFYvzbNm4knWrF3J9IYtSQq0e8+C2r+jwDXvefYjEWja98B2DQyU6fINty8cVCigl9HYHiMCOzWs4/HuR4XNl3n5mPbmsB0DgGyYrDR69ewXvvXgXgW+oNxLOX6ySJJaebp/+ZQWOD5fIZT2cS5WddRGCw9oU5rVtA1SqEfmcTxRZPE8RxZbe7oBXnlpH4BtGx0Ke2PkNt624jte3DzBWqjF4ZhzP6GYBOtw1qtC07Y2I0IgTisUKtyztBaB4voLWQl8hS1iLuL2/j0V9OQC+/fkkx4ZK3L9hGQt6Oyj0BCiR1qZpwV5dgRn7gBLh1Y8OcmpkAoDndv3E6IUQgCRx9BWy6b91bH64n7P7tvL8lrU4l/pOi6dSRZWSaShmJgDPKIbPTfLy+wdYfEMXB46M0JXLNE8ElWoEQK0e8/fJi8SJpa+QZemi7hmiOSphxESlQRRb/IzGKMHNBOCaJwTI53wOHhnBM5pCPqDRSFIHrTh1drzls/2Nffx18h+efGwV7+y8kyi2l+O5VKW1KxeycEEn2Q6PPwfHKE3WMVpwrg1AAK1TkaxzBBlDEGiSxLXsgW84cWacE2fGWX5TnnsHlnB8qEQ2SG+J1qnM0lTLaMVbO+5AJL2ijzy9l7FSDaMV4FIAh0MpoRxGfL1vECRtHiK0Gsj+w8OcHpmkeKFCWIv54dAQWx9fxfo1N/Lxl38wVJzgx1+HCGsx1XoMwN79gy1VfU9zujjB2dFJfE9dLtKpb0JrHeUwzW8u66Gm3N9yGJEkls6sR5I4+pcX2PTArez+7DcmK+lcWIsRgc5mzyhXoivSq5W0+klL9fZH6SWpL9VCy64ERLDW4lyaorAaE2Q0xihE0kqnmfepsaZSJPYanXCmjVt265rnaAKJkM9lsM7hXLPg2nyvFuuaALMdjumn+T9jzh8k8wDzAPMAcw7wLz7iq04ifbsDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA0LTE3VDE0OjM5OjU2LTA0OjAw6I0f5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wNC0xN1QxNDozOTo1Ni0wNDowMJnQp1gAAAAASUVORK5CYII=
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js
// @downloadURL  https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js
// @supportURL   https://github.com/mattiadr/MALstreaming/issues
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/ownlist/anime/*/edit*
// @match        https://myanimelist.net/ownlist/anime/add?selected_series_id=*
// @match        https://myanimelist.net/mangalist/*
// @match        https://myanimelist.net/ownlist/manga/*/edit*
// @match        https://myanimelist.net/ownlist/manga/add?selected_manga_id=*
// @match        https://9anime.to/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.rawgit.com/dcodeIO/protobuf.js/6.8.8/dist/protobuf.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @connect      *
// ==/UserScript==

