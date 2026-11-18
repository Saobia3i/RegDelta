"""Compatibility import path for the package's existing public module name.

The implementation lives in ``tensor_ops``; Docker, migrations, and existing
tests import it as ``RegDelta_ops``. Re-export the package search path so those
imports resolve to the same source tree without duplicating the application.
"""
from tensor_ops import __path__ as __path__
