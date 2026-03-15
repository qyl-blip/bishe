import fs from 'fs';
import { graphviz } from '@hpcc-js/wasm';

const dot = `digraph ER {
  graph [rankdir=TB, splines=ortho, nodesep=0.4, ranksep=0.6, bgcolor="white"];
  node [fontname="Microsoft YaHei", fontsize=14, penwidth=1.2, color="#666666"];
  edge [color="#666666", penwidth=1.0];

  User [label="用户", shape=box, style=rounded];
  Service [label="家政服务", shape=box, style=rounded];
  Appt [label="预约", shape=box, style=rounded];
  Order [label="订单", shape=box, style=rounded];
  Review [label="评价", shape=box, style=rounded];
  Admin [label="管理员", shape=box, style=rounded];

  U1 [label="用户号", shape=ellipse];
  U2 [label="用户名", shape=ellipse];
  U3 [label="密码", shape=ellipse];
  U4 [label="电话", shape=ellipse];

  S1 [label="服务编号", shape=ellipse];
  S2 [label="服务名称", shape=ellipse];
  S3 [label="价格", shape=ellipse];
  S4 [label="状态", shape=ellipse];

  A1 [label="预约号", shape=ellipse];
  A2 [label="预约日期", shape=ellipse];
  A3 [label="时间段", shape=ellipse];
  A4 [label="状态", shape=ellipse];

  O1 [label="订单号", shape=ellipse];
  O2 [label="下单时间", shape=ellipse];
  O3 [label="支付时间", shape=ellipse];
  O4 [label="状态", shape=ellipse];

  R1 [label="评价号", shape=ellipse];
  R2 [label="评分", shape=ellipse];
  R3 [label="内容", shape=ellipse];
  R4 [label="时间", shape=ellipse];

  M1 [label="管理员号", shape=ellipse];
  M2 [label="账号", shape=ellipse];
  M3 [label="密码", shape=ellipse];

  Rel1 [label="预约", shape=diamond];
  Rel2 [label="下单", shape=diamond];
  Rel3 [label="评价", shape=diamond];
  Rel4 [label="管理", shape=diamond];

  User -> U1 [dir=none];
  User -> U2 [dir=none];
  User -> U3 [dir=none];
  User -> U4 [dir=none];

  Service -> S1 [dir=none];
  Service -> S2 [dir=none];
  Service -> S3 [dir=none];
  Service -> S4 [dir=none];

  Appt -> A1 [dir=none];
  Appt -> A2 [dir=none];
  Appt -> A3 [dir=none];
  Appt -> A4 [dir=none];

  Order -> O1 [dir=none];
  Order -> O2 [dir=none];
  Order -> O3 [dir=none];
  Order -> O4 [dir=none];

  Review -> R1 [dir=none];
  Review -> R2 [dir=none];
  Review -> R3 [dir=none];
  Review -> R4 [dir=none];

  Admin -> M1 [dir=none];
  Admin -> M2 [dir=none];
  Admin -> M3 [dir=none];

  User -> Rel1 [label="发起", dir=none];
  Rel1 -> Appt [dir=none];
  Rel1 -> Service [dir=none];

  User -> Rel2 [label="创建", dir=none];
  Rel2 -> Order [dir=none];
  Rel2 -> Service [dir=none];

  User -> Rel3 [label="发表", dir=none];
  Rel3 -> Review [dir=none];
  Rel3 -> Service [dir=none];

  Admin -> Rel4 [label="管理", dir=none];
  Rel4 -> User [dir=none];
  Rel4 -> Service [dir=none];
  Rel4 -> Order [dir=none];
}`;

const svg = await graphviz.layout(dot, "svg", "dot");
fs.writeFileSync("D:/web/er-diagram.svg", svg);
