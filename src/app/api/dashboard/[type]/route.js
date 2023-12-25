import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  deleteField,
  Timestamp,
} from "firebase/firestore";
import { authenticate } from "@/utils/auth";
import { AUTH } from "@/data/dynamic/admin/Admins";
import SG from "@/utils/sendgrid";
import { ATTRIBUTES } from "@/data/dynamic/admin/Attributes";
const types = new Set([
  "admins",
  "committees",
  "judges",
  "mentors",
  "volunteers",
  "participants",
  "interests",
  "sponsors",
]);
export async function POST(req, { params }) {
  const res = NextResponse;
  const { auth, message, user } = await authenticate(AUTH.POST);

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }
  const data = await req.json();

  try {
    if (types.has(params.type)) {
      const element = {};
      ATTRIBUTES[params.type].forEach((attribute) => {
        element[attribute] = data[attribute];
      });
      await updateDoc(doc(db, "users", user.id), {
        ...element,
        timestamp: Timestamp.now(),
        [`roles.${params.type}`]: 0,
      });
      SG.send({
        to: user.email,
        template_id: process.env.SENDGRID_CONFIRMATION_TEMPLATE,
        dynamic_template_data: {
          name: user.name,
          position: params.type.slice(0, -1).toUpperCase(),
        },
      });
    }

    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const res = NextResponse;
  const { auth, message } = await authenticate(AUTh.GET);

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }

  const output = [];
  try {
    let snapshot;
    if (types.has(params.type)) {
      snapshot = await getDocs(
        query(
          collection(db, "users"),
          where(`roles.${params.type}`, "in", [-1, 0, 1])
        )
      );
      snapshot.forEach((doc) => {
        const data = doc.data();
        const element = {};
        ATTRIBUTES[params.type].forEach((attribute) => {
          element[attribute] = data[attribute];
        });
        output.push({
          ...element,
          uid: doc.id,
          timestamp: data.timestamp,
          status: data.roles[params.type],
          selected: false,
          hidden: false,
        });
      });
    }

    const sorted = output.sort((a, b) =>
      a.timestamp.seconds < b.timestamp.seconds ? 1 : -1
    );
    return res.json({ message: "OK", items: sorted }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const res = NextResponse;
  const { objects, status } = await req.json();
  const { auth, message } = await authenticate(AUTH.PUT);

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }
  try {
    if (types.has(params.type)) {
      objects.map(async (object) => {
        await updateDoc(doc(db, "users", object.uid), {
          [`roles.${params.type}`]: status,
        });
        SG.send({
          to: object.email,
          template_id:
            status === 1
              ? process.env.SENDGRID_ACCEPTANCE_TEMPLATE
              : process.env.SENDGRID_REJECTION_TEMPLATE,
          dynamic_template_data: {
            name: object.name,
            position: params.type.slice(0, -1).toUpperCase(),
          },
        });
      });
    }
    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const res = NextResponse;
  const { auth, message } = await authenticate(AUTH.DELETE);
  const objects = req.nextUrl.searchParams.get("remove").split(",");

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }
  try {
    if (types.has(params.type)) {
      objects.map(async (object) => {
        await updateDoc(doc(db, "users", object), {
          [`roles.${params.type}`]: deleteField(),
        });
      });
    }
    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}
