# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト状態

現時点ではコードは存在しない。`requirements.md`（要件定義書）のみの計画段階。`package.json`やビルド設定はまだ無いため、ビルド/lint/testコマンドは未定義。プロジェクトの雛形を作成した時点で、このセクションに実際のコマンド（`npm run dev`、`npm run build`、`npm run lint`、テスト実行コマンドなど）を追記すること。

## 要件の正（source of truth）

`requirements.md` がこのプロジェクトの唯一の要件定義書。実装・設計判断で迷った場合は必ずこれを確認する。要件定義書にない仕様を独自に推測しない。判断が必要な場合はユーザーに確認するか、「4. 非機能要件」「5. 制約条件」に沿った妥当なデフォルトを選ぶ。

対象システム: 副業Webライターを主ペルソナとする、応募〜入金までを一元管理するフリーランス向け案件管理Webアプリ（`requirements.md` 1章参照）。

## 技術構成（制約条件より）

Next.js（TypeScript、App Router）＋ Supabase（認証・DB、Row Level Securityでユーザーごとにデータ分離）＋ Vercel（ホスティング）。外部連携・AI機能はMVPでは実装しない（v2.0以降）。

## 実装の進め方

- 機能の優先順位は `requirements.md` 3章の Phase 列（MVP → v1.0 → v2.0）に従う。MVP（F-01〜F-12）から着手する。
- 複数ファイルにまたがる実装は、いきなり書き始めずPlan Modeで設計案を提示し、承認を得てから実装する。
- 1機能ずつ「実装 → 動作確認 → コミット」の小さいサイクルで進める。一度に複数機能をまとめて実装しない。
- 画面構成・ナビゲーション構造は `requirements.md` 6章の画面遷移に従う（最大3層、主要機能は2クリック以内）。
