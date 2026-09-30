(function () {
  "use strict";
  const U = Pandao,
    B = Business;
  const app = U.mount({
    title: "报价单生成器",
    icon: "▤",
    category: "销售与交付",
    description: "编辑项目、数量、单价与折扣，生成报价单，支持打印和表格导出。",
    repo: "https://github.com/tianchaodaxing-beep/pandao-quote",
  });
  const p = U.panel("报价信息"),
    form = U.h("form"),
    grid = U.h("div", { class: "grid" });
  const today = new Date();
  const now = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  for (const [label, key, val, type] of [
    ["供应方", "seller", "演示供应方", "text"],
    ["客户", "buyer", "演示客户", "text"],
    ["报价编号", "reference", "BJ-" + now.replace(/-/g, ""), "text"],
    ["报价日期", "date", now, "date"],
    ["币种", "currency", "人民币", "text"],
    ["折扣（%）", "discount", 0, "number"],
    ["税率（%）", "tax", 0, "number"],
    ["有效天数", "valid", 15, "number"],
  ])
    grid.append(U.field(label, key, val, type).wrap);
  form.append(grid);
  p.append(form);
  const items = U.h("div", { id: "quote-items" });
  p.append(
    U.h("div", { class: "divider" }),
    U.h("h3", { text: "报价项目" }),
    items,
  );
  let list = [
      { name: "演示产品", quantity: 10, price: 120 },
      { name: "安装服务", quantity: 1, price: 300 },
    ],
    last = null;
  const note = U.field(
    "交付与付款说明",
    "note",
    "确认报价后另行约定交付时间与付款方式。",
    "textarea",
  );
  p.append(
    note.wrap,
    U.actions(
      U.button("添加项目", () => {
        list.push({ name: "", quantity: 1, price: 0 });
        drawItems();
      }),
      U.button("生成报价", U.run(render), true),
    ),
  );
  app.input.append(
    p,
    U.dataPanel(
      "从表格导入项目",
      [{ 项目名称: "演示产品", 数量: 10, 单价: 120 }],
      (data) => {
        list = data.rows.map((r) => ({
          name: r["项目名称"],
          quantity: r["数量"],
          price: r["单价"],
        }));
        drawItems();
        render();
      },
    ),
  );
  const out = U.panel("报价预览");
  app.output.append(out);
  function drawItems() {
    U.clear(items);
    for (const [i, row] of list.entries()) {
      const box = U.h("div", { class: "item-editor" });
      for (const [k, label] of [
        ["name", "项目名称"],
        ["quantity", "数量"],
        ["price", "单价"],
      ]) {
        const f = U.field(
          label,
          "item-" + i + "-" + k,
          row[k],
          k === "name" ? "text" : "number",
        );
        f.input.addEventListener("input", () => (row[k] = f.input.value));
        box.append(f.wrap);
      }
      box.append(
        U.button("移除", () => {
          list.splice(i, 1);
          drawItems();
        }),
      );
      items.append(box);
    }
  }
  function render() {
    const data = U.values(form),
      v = B.quote(list, data.discount, data.tax);
    B.num(data.valid, "有效天数", 1, 3650);
    if (
      !data.seller.trim() ||
      !data.buyer.trim() ||
      !data.reference.trim() ||
      !data.date
    )
      throw Error("请填写供应方、客户、编号和日期");
    last = { data, ...v, note: note.input.value };
    U.clear(out).append(
      U.h("div", { class: "quote", id: "print-quote" }, [
        U.h("header", {}, [
          U.h("div", {}, [
            U.h("h2", { text: "报价单" }),
            U.h("p", { text: data.seller }),
          ]),
          U.h("div", {}, [
            U.h("p", { text: data.reference }),
            U.h("p", { text: data.date }),
          ]),
        ]),
        U.h("p", { text: "客户：" + data.buyer }),
        U.h("p", {
          text: "币种：" + data.currency + " · 有效期：" + data.valid + "天",
        }),
        U.table(
          [
            { key: "name", label: "项目" },
            { key: "quantity", label: "数量", number: true },
            {
              key: "price",
              label: "单价",
              number: true,
              value: (r) => U.money(r.price),
            },
            {
              key: "amount",
              label: "金额",
              number: true,
              value: (r) => U.money(r.amount),
            },
          ],
          v.lines,
        ),
        U.h("div", { class: "divider" }),
        U.h("p", {
          text:
            "项目合计：" +
            U.money(v.subtotal) +
            "　折扣：" +
            U.money(v.discount) +
            "　税额：" +
            U.money(v.tax),
        }),
        U.h("p", {
          class: "sum",
          text: "报价合计 " + U.money(v.total) + " " + data.currency,
        }),
        U.h("p", { text: note.input.value }),
      ]),
      U.actions(
        U.button("打印或保存PDF", () => window.print()),
        U.button("导出报价表格", () =>
          U.exportRows("报价单.xlsx", [
            ...v.lines.map((r) => ({
              报价编号: data.reference,
              客户: data.buyer,
              币种: data.currency,
              项目: r.name,
              数量: r.quantity,
              单价: r.price,
              金额: r.amount,
            })),
            { 项目: "折扣", 金额: -v.discount },
            { 项目: "税额", 金额: v.tax },
            { 项目: "报价合计", 金额: v.total },
          ]),
        ),
      ),
    );
    U.source("报价：" + data.reference);
  }
  drawItems();
  render();
  U.source("演示数据");
})();
